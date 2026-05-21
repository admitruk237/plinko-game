#!/usr/bin/env bash
# Full documentation audit: checks integrity, finds unmapped slices, validates CLAUDE.md size.
# Intended for manual runs or CI pipelines.
#
# Usage:
#   bash scripts/audit-docs.sh
#   npm run doc:audit

set -euo pipefail

# ── Constants ─────────────────────────────────────────────────────────────────
readonly DOC_MAPPING=".claude/doc-mapping.json"
readonly CLAUDE_MD="CLAUDE.md"
readonly MAX_CLAUDE_MD_LINES=200
readonly SRC_DIR="src"
readonly RULES_DIR=".claude/rules"
readonly DOCS_DIR=".claude/docs"

# ── Helpers ───────────────────────────────────────────────────────────────────
log_ok()    { echo "  ✅ $*"; }
log_warn()  { echo "  ⚠️  $*"; }
log_error() { echo "  ❌ $*"; ERRORS=$(( ERRORS + 1 )); }
log_step()  { echo ""; echo "── $* "; echo "$(printf '%.0s─' {1..60})"; }

has_node() { command -v node &>/dev/null; }

ERRORS=0
WARNINGS=0

# ── Guards ────────────────────────────────────────────────────────────────────
if [[ ! -f "$DOC_MAPPING" ]]; then
  echo "❌ Doc mapping not found: $DOC_MAPPING"
  exit 1
fi

if ! has_node; then
  echo "❌ node is required for JSON parsing but was not found."
  exit 1
fi

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║        Documentation Audit Report            ║"
echo "╚══════════════════════════════════════════════╝"

# ── 1. Check all mapped files exist ──────────────────────────────────────────
log_step "1. Integrity — checking all mapped files exist"

MISSING=$(DOC_MAPPING="$DOC_MAPPING" node - << 'NODEEOF'
const fs = require('fs');
const mapping = JSON.parse(fs.readFileSync(process.env.DOC_MAPPING, 'utf8'));
const missing = [];

for (const entry of mapping.mappings) {
  for (const key of ['doc', 'rules']) {
    const path = entry[key];
    if (path && !fs.existsSync(path)) {
      missing.push(`${key.toUpperCase()}: ${path}  (mapped by pattern: ${entry.pattern})`);
    }
  }
}
missing.forEach(m => console.log(m));
NODEEOF
)

if [[ -z "$MISSING" ]]; then
  log_ok "All mapped files exist."
else
  while IFS= read -r line; do
    [[ -z "$line" ]] && continue
    log_error "Missing: $line"
    ERRORS=$(( ERRORS + 1 ))
  done <<< "$MISSING"
fi

# ── 2. Find src/ slices not covered by any mapping ───────────────────────────
log_step "2. Coverage — src/ slices not covered by doc-mapping.json"

UNMAPPED=$(DOC_MAPPING="$DOC_MAPPING" SRC_DIR="$SRC_DIR" node - << 'NODEEOF'
const fs   = require('fs');
const path = require('path');

const mapping    = JSON.parse(fs.readFileSync(process.env.DOC_MAPPING, 'utf8'));
const srcDir     = process.env.SRC_DIR || 'src';
const prefixes   = mapping.mappings.map(e => e.pattern.replace(/\/\*\*.*$/, ''));

// Walk src/ up to depth 3 to find slice-level directories
function walk(dir, depth) {
  if (depth > 3) return [];
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name).replace(/\\/g, '/');
    // Skip node_modules, .next, build outputs
    if (['node_modules', '.next', 'out', 'dist'].includes(entry.name)) continue;
    results.push(full);
    results = results.concat(walk(full, depth + 1));
  }
  return results;
}

const allDirs  = walk(srcDir, 0);
const unmapped = allDirs.filter(d => {
  // Check if any prefix covers this directory
  return !prefixes.some(p => d.startsWith(p) || p.startsWith(d));
});

// Only report leaf-ish dirs (no children that are also unmapped)
const leafUnmapped = unmapped.filter(d =>
  !unmapped.some(other => other !== d && other.startsWith(d + '/'))
);

leafUnmapped.forEach(d => console.log(d));
NODEEOF
)

if [[ -z "$UNMAPPED" ]]; then
  log_ok "All src/ slices are covered by doc-mapping.json."
else
  log_warn "The following src/ directories have no doc mapping:"
  while IFS= read -r dir; do
    [[ -z "$dir" ]] && continue
    echo "       $dir"
    WARNINGS=$(( WARNINGS + 1 ))
  done <<< "$UNMAPPED"
  echo ""
  echo "  → Consider adding entries to $DOC_MAPPING for the above paths."
fi

# ── 3. Check rules/ directory for orphan rule files ──────────────────────────
log_step "3. Orphans — rule files not referenced in doc-mapping.json"

ORPHAN_RULES=$(DOC_MAPPING="$DOC_MAPPING" RULES_DIR="$RULES_DIR" node - << 'NODEEOF'
const fs   = require('fs');
const path = require('path');

const mapping    = JSON.parse(fs.readFileSync(process.env.DOC_MAPPING, 'utf8'));
const rulesDir   = process.env.RULES_DIR;
const mappedRules = new Set(
  mapping.mappings.map(e => e.rules).filter(Boolean)
);

if (!fs.existsSync(rulesDir)) { process.exit(0); }

for (const file of fs.readdirSync(rulesDir)) {
  const full = path.join(rulesDir, file).replace(/\\/g, '/');
  if (!mappedRules.has(full)) {
    console.log(full);
  }
}
NODEEOF
)

if [[ -z "$ORPHAN_RULES" ]]; then
  log_ok "All rule files are referenced in doc-mapping.json."
else
  log_warn "Rule files not referenced in doc-mapping.json:"
  while IFS= read -r file; do
    [[ -z "$file" ]] && continue
    echo "       $file"
    WARNINGS=$(( WARNINGS + 1 ))
  done <<< "$ORPHAN_RULES"
fi

# ── 4. Check CLAUDE.md line count ────────────────────────────────────────────
log_step "4. Size — $CLAUDE_MD line count (limit: $MAX_CLAUDE_MD_LINES)"

if [[ ! -f "$CLAUDE_MD" ]]; then
  log_error "$CLAUDE_MD not found."
  ERRORS=$(( ERRORS + 1 ))
else
  LINE_COUNT=$(wc -l < "$CLAUDE_MD")
  if (( LINE_COUNT > MAX_CLAUDE_MD_LINES )); then
    log_error "$CLAUDE_MD has $LINE_COUNT lines — exceeds $MAX_CLAUDE_MD_LINES limit."
    echo "         Run: claude \"Shorten and optimize $CLAUDE_MD to max $MAX_CLAUDE_MD_LINES lines without losing critical instructions.\""
    ERRORS=$(( ERRORS + 1 ))
  else
    log_ok "$CLAUDE_MD: $LINE_COUNT / $MAX_CLAUDE_MD_LINES lines."
  fi
fi

# ── 5. Summary ────────────────────────────────────────────────────────────────
echo ""
echo "══════════════════════════════════════════════════════════"
echo "  Audit Summary"
echo "══════════════════════════════════════════════════════════"
echo "  ❌ Errors:   $ERRORS"
echo "  ⚠️  Warnings: $WARNINGS"
echo ""

if (( ERRORS > 0 )); then
  echo "  Result: FAILED — fix errors above before committing."
  exit 1
elif (( WARNINGS > 0 )); then
  echo "  Result: PASSED with warnings — consider addressing them."
  exit 0
else
  echo "  Result: ✅ PASSED — documentation is clean."
  exit 0
fi
