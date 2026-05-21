#!/usr/bin/env bash
# Run only tests related to files changed since the last commit (or compared to main).
# Usage:
#   bash scripts/run-related-tests.sh           # changed vs HEAD
#   bash scripts/run-related-tests.sh main      # changed vs main branch
#   bash scripts/run-related-tests.sh --all     # run all tests

set -euo pipefail

BASE_REF="${1:-HEAD}"
ALL_TESTS=false

if [[ "$BASE_REF" == "--all" ]]; then
  ALL_TESTS=true
fi

# ── Collect changed source files ──────────────────────────────────────────────

if [[ "$ALL_TESTS" == true ]]; then
  CHANGED_FILES=""
elif [[ "$BASE_REF" == "HEAD" ]]; then
  # Staged + unstaged changes vs last commit
  CHANGED_FILES=$(git diff --name-only HEAD 2>/dev/null || true)
  # Also include untracked files that match src/
  UNTRACKED=$(git ls-files --others --exclude-standard src/ 2>/dev/null || true)
  CHANGED_FILES=$(printf '%s\n%s' "$CHANGED_FILES" "$UNTRACKED")
else
  # Changes between current branch and base ref (e.g. main)
  CHANGED_FILES=$(git diff --name-only "${BASE_REF}...HEAD" 2>/dev/null || true)
fi

# ── Filter to src/ TypeScript files (exclude test files themselves) ───────────

SRC_FILES=$(echo "$CHANGED_FILES" \
  | grep -E '^src/.*\.(ts|tsx)$' \
  | grep -vE '\.(test|spec)\.' \
  | grep -v '__tests__' \
  || true)

# ── Build test path patterns from changed file names ─────────────────────────

declare -a PATTERNS=()

while IFS= read -r file; do
  [[ -z "$file" ]] && continue

  # Extract base name without extension: useGamePlay.ts → useGamePlay
  BASENAME=$(basename "$file" | sed 's/\.\(ts\|tsx\)$//')

  # Look for a co-located test file first
  DIR=$(dirname "$file")
  COLOCATED_TEST="${DIR}/${BASENAME}.test.ts"
  COLOCATED_TSX="${DIR}/${BASENAME}.test.tsx"
  NESTED_TEST="${DIR}/__tests__/${BASENAME}.test.ts"
  NESTED_TSX="${DIR}/__tests__/${BASENAME}.test.tsx"

  if [[ -f "$COLOCATED_TEST" || -f "$COLOCATED_TSX" || -f "$NESTED_TEST" || -f "$NESTED_TSX" ]]; then
    # Exact test file exists — use it directly
    PATTERNS+=("${BASENAME}\\.test\\.(ts|tsx)")
  else
    # No test file yet — still add pattern so Jest reports "no tests found" cleanly
    PATTERNS+=("${BASENAME}\\.test\\.(ts|tsx)")
  fi
done <<< "$SRC_FILES"

# ── Run ───────────────────────────────────────────────────────────────────────

if [[ "$ALL_TESTS" == true || ${#PATTERNS[@]} -eq 0 ]]; then
  if [[ ${#PATTERNS[@]} -eq 0 && "$ALL_TESTS" == false ]]; then
    echo "ℹ No changed source files detected — running full test suite."
  else
    echo "ℹ Running full test suite."
  fi
  npx jest --passWithNoTests
else
  # Deduplicate patterns and join with |
  UNIQUE_PATTERNS=$(printf '%s\n' "${PATTERNS[@]}" | sort -u | tr '\n' '|' | sed 's/|$//')
  CHANGED_NAMES=$(echo "$SRC_FILES" | xargs -I{} basename {} | sed 's/\.\(ts\|tsx\)$//' | sort -u | tr '\n' ' ')

  echo "📂 Changed files: $CHANGED_NAMES"
  echo "🧪 Running tests matching: $UNIQUE_PATTERNS"
  echo ""

  npx jest --testPathPattern="$UNIQUE_PATTERNS" --passWithNoTests
fi
