#!/usr/bin/env bash
# Check test coverage and report files below threshold.
# Usage:
#   bash scripts/check-test-coverage.sh            # use threshold from jest.config.ts (default 70%)
#   bash scripts/check-test-coverage.sh 80         # override threshold to 80%
#   bash scripts/check-test-coverage.sh --changed  # coverage only for files changed vs HEAD

set -euo pipefail

THRESHOLD="${1:-}"
CHANGED_ONLY=false

if [[ "$THRESHOLD" == "--changed" ]]; then
  CHANGED_ONLY=true
  THRESHOLD=""
fi

# ── Build coverage collect pattern (changed files only, optional) ─────────────

COLLECT_PATTERN=""

if [[ "$CHANGED_ONLY" == true ]]; then
  CHANGED_FILES=$(git diff --name-only HEAD 2>/dev/null || true)
  SRC_FILES=$(echo "$CHANGED_FILES" \
    | grep -E '^src/.*\.(ts|tsx)$' \
    | grep -vE '\.(test|spec)\.' \
    | grep -v '__tests__' \
    || true)

  if [[ -z "$SRC_FILES" ]]; then
    echo "ℹ No changed source files — running full coverage report."
  else
    # Pass as --collectCoverageFrom patterns
    COLLECT_ARGS=""
    while IFS= read -r file; do
      [[ -z "$file" ]] && continue
      COLLECT_ARGS="$COLLECT_ARGS --collectCoverageFrom=$file"
    done <<< "$SRC_FILES"
    COLLECT_PATTERN="$COLLECT_ARGS"
    echo "📂 Checking coverage for changed files only:"
    echo "$SRC_FILES" | sed 's/^/  /'
    echo ""
  fi
fi

# ── Build threshold args ──────────────────────────────────────────────────────

THRESHOLD_ARGS=""
if [[ -n "$THRESHOLD" ]]; then
  # Override global threshold from CLI argument
  THRESHOLD_JSON="{\"global\":{\"branches\":${THRESHOLD},\"functions\":${THRESHOLD},\"lines\":${THRESHOLD},\"statements\":${THRESHOLD}}}"
  THRESHOLD_ARGS="--coverageThreshold='${THRESHOLD_JSON}'"
  echo "🎯 Coverage threshold: ${THRESHOLD}%"
else
  echo "🎯 Using threshold from jest.config.ts"
fi

echo ""

# ── Run Jest with coverage ────────────────────────────────────────────────────

CMD="npx jest --coverage --passWithNoTests $COLLECT_PATTERN"

# shellcheck disable=SC2086
eval $CMD

EXIT_CODE=$?

# ── Summary ───────────────────────────────────────────────────────────────────

echo ""
if [[ $EXIT_CODE -eq 0 ]]; then
  echo "✅ Coverage check passed."
else
  echo "❌ Coverage check FAILED — one or more files are below threshold."
  echo ""
  echo "To see the full HTML report:"
  echo "  open coverage/index.html"
fi

exit $EXIT_CODE
