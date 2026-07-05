#!/usr/bin/env bash
# Checks whether documentation is stale relative to changed source files.
# Auto-updates docs via the Claude CLI and stages them for the current commit.
# Runs automatically as a git pre-commit hook.
#
# Usage:
#   bash scripts/check-doc-freshness.sh          # staged files + diff vs main
#   SKIP_AI_UPDATE=1 bash scripts/check-doc-freshness.sh  # dry-run, no AI calls

set -euo pipefail

# ── Constants ─────────────────────────────────────────────────────────────────
readonly DOC_MAPPING=".claude/doc-mapping.json"
readonly CLAUDE_MD="CLAUDE.md"
readonly BASE_BRANCH="main"
readonly MAX_CLAUDE_MD_LINES=200
readonly SKIP_AI_UPDATE="${SKIP_AI_UPDATE:-0}"

# ── Helpers ───────────────────────────────────────────────────────────────────
log_info()  { echo "  $*"; }
log_ok()    { echo "✅ $*"; }
log_warn()  { echo "⚠️  $*"; }
log_error() { echo "❌ $*" >&2; }
log_step()  { echo ""; echo "── $* ──────────────────────────────────────"; }

has_node()   { command -v node  &>/dev/null; }
has_claude() { command -v claude &>/dev/null; }

# ── Guards ────────────────────────────────────────────────────────────────────
if [[ ! -f "$DOC_MAPPING" ]]; then
  log_warn "Doc mapping not found at $DOC_MAPPING — skipping freshness check."
  exit 0
fi

if ! has_node; then
  log_warn "node not found — skipping freshness check."
  exit 0
fi

# ── Collect changed source files ──────────────────────────────────────────────
log_step "Collecting changed source files"

STAGED_FILES=$(git diff --cached --name-only 2>/dev/null || true)
DIFF_MAIN_FILES=$(git diff "$BASE_BRANCH" --name-only 2>/dev/null || true)

# Union of staged and diff-vs-main, filtered to src/ (no test files, no docs)
ALL_CHANGED=$(
  printf '%s\n%s' "$STAGED_FILES" "$DIFF_MAIN_FILES" \
  | sort -u \
  | grep -E '^src/.*\.(ts|tsx|js|jsx)$' \
  | grep -vE '\.(test|spec)\.(ts|tsx)$' \
  | grep -v '__tests__' \
  || true
)

if [[ -z "$ALL_CHANGED" ]]; then
  log_ok "No source file changes — docs are up to date."
  exit 0
fi

log_info "Changed source files:"
echo "$ALL_CHANGED" | sed 's/^/    /'

# ── Find stale doc/rules files ────────────────────────────────────────────────
log_step "Checking doc freshness against $DOC_MAPPING"

# ALL_CHANGED_JSON: JS-safe string for inline node script
ALL_CHANGED_JSON=$(echo "$ALL_CHANGED" | jq -R -s '.' 2>/dev/null || node -e "
  const lines = $(printf '%s' "$ALL_CHANGED" | node -e "
    let d=''; process.stdin.on('data',c=>d+=c).on('end',()=>{
      process.stdout.write(JSON.stringify(d));
    });
  ");
  process.stdout.write(JSON.stringify(lines));
")

# Use node to match patterns and find stale docs; output: "docPath|triggerFile"
STALE_ENTRIES=$(ALL_CHANGED="$ALL_CHANGED" node - << 'NODEEOF'
const fs  = require('fs');
const mapping = JSON.parse(fs.readFileSync(process.env.DOC_MAPPING || '.claude/doc-mapping.json', 'utf8'));
const changedFiles = (process.env.ALL_CHANGED || '').split('\n').filter(Boolean);
const changedSet   = new Set(changedFiles);

// Deduplicate by docPath to avoid calling claude twice for the same file
const seenDocs = new Set();
const results  = [];

for (const entry of mapping.mappings) {
  // "src/app/**" → prefix "src/app"
  const prefix = entry.pattern.replace(/\/\*\*.*$/, '');

  const trigger = changedFiles.find(f => f.startsWith(prefix + '/') || f === prefix);
  if (!trigger) continue;

  for (const docKey of ['doc', 'rules']) {
    const docPath = entry[docKey];
    if (!docPath) continue;
    if (seenDocs.has(docPath)) continue;
    if (changedSet.has(docPath)) { seenDocs.add(docPath); continue; } // already updated

    seenDocs.add(docPath);
    results.push(docPath + '|' + trigger);
  }
}

results.forEach(r => console.log(r));
NODEEOF
)

if [[ -z "$STALE_ENTRIES" ]]; then
  log_ok "All docs are up to date."
else
  # ── Auto-update stale docs via Claude CLI ──────────────────────────────────
  log_step "Updating stale documentation"

  while IFS='|' read -r DOC_PATH SRC_FILE; do
    [[ -z "$DOC_PATH" ]] && continue

    log_warn "Stale: $DOC_PATH  (trigger: $SRC_FILE)"

    if [[ "$SKIP_AI_UPDATE" == "1" ]]; then
      log_info "  SKIP_AI_UPDATE=1 — skipping Claude call."
      continue
    fi

    if ! has_claude; then
      log_warn "  claude CLI not found — update $DOC_PATH manually."
      continue
    fi

    log_info "  Calling Claude CLI to update $DOC_PATH ..."
    claude "Update file $DOC_PATH based on recent changes in $SRC_FILE. Read both files and update the documentation to stay accurate and current."

    if [[ -f "$DOC_PATH" ]]; then
      git add "$DOC_PATH"
      log_ok "Updated and staged: $DOC_PATH"
    else
      log_error "Expected $DOC_PATH to exist after update — skipping git add."
    fi

  done <<< "$STALE_ENTRIES"
fi

# ── Check CLAUDE.md line count ────────────────────────────────────────────────
log_step "Checking $CLAUDE_MD size"

if [[ ! -f "$CLAUDE_MD" ]]; then
  log_warn "$CLAUDE_MD not found — skipping line count check."
  exit 0
fi

LINE_COUNT=$(wc -l < "$CLAUDE_MD")
log_info "$CLAUDE_MD: $LINE_COUNT lines (limit: $MAX_CLAUDE_MD_LINES)"

if (( LINE_COUNT > MAX_CLAUDE_MD_LINES )); then
  log_warn "$CLAUDE_MD exceeds $MAX_CLAUDE_MD_LINES lines ($LINE_COUNT found)."

  if [[ "$SKIP_AI_UPDATE" == "1" ]]; then
    log_info "SKIP_AI_UPDATE=1 — skipping Claude call."
  elif has_claude; then
    log_info "Calling Claude CLI to shorten $CLAUDE_MD ..."
    claude "Shorten and optimize $CLAUDE_MD so it contains at most $MAX_CLAUDE_MD_LINES lines without losing critical instructions. Edit the file in place."

    NEW_COUNT=$(wc -l < "$CLAUDE_MD")
    git add "$CLAUDE_MD"
    log_ok "$CLAUDE_MD shortened to $NEW_COUNT lines and staged."
  else
    log_warn "claude CLI not found — shorten $CLAUDE_MD manually."
  fi
else
  log_ok "$CLAUDE_MD is within the $MAX_CLAUDE_MD_LINES-line limit."
fi

echo ""
log_ok "Doc freshness check complete."
