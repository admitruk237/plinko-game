#!/bin/bash
# Blocks Write/Edit that introduce style={} inline styles in src/*.tsx files.
# Reads Claude Code hook JSON from stdin.

input=$(cat)
tool=$(echo "$input" | jq -r '.tool_name')
file=$(echo "$input" | jq -r '.tool_input.file_path // empty')

# Only enforce on src/ TSX/JSX files
echo "$file" | grep -qE 'src/.*\.(tsx|jsx)$' || exit 0

if [ "$tool" = "Write" ]; then
  content=$(echo "$input" | jq -r '.tool_input.content // empty')
elif [ "$tool" = "Edit" ]; then
  content=$(echo "$input" | jq -r '.tool_input.new_string // empty')
else
  exit 0
fi

# Skip comment lines and type/interface definitions, then check for style={
if echo "$content" | grep -vE '^\s*(//|/\*|\*|interface |type )' | grep -qE 'style=\{'; then
  echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"Inline style={} detected — use Tailwind CSS classes instead (components.md rule). Replace with className and cn() if conditional."}}'
fi
