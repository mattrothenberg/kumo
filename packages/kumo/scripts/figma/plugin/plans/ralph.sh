#!/usr/bin/env bash
set -e

# Ralph Wiggum - A simple bash loop for AI coding agents
# Based on Matt Pocock's technique
# Usage: ./ralph.sh <max_iterations>

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -z "$1" ]; then
  echo "Usage: $0 <max_iterations>"
  echo "Example: $0 10"
  exit 1
fi

MAX_ITERATIONS=$1

for ((i=1; i<=MAX_ITERATIONS; i++)); do
  echo "==============================="
  echo "Ralph iteration $i of $MAX_ITERATIONS"
  echo "==============================="
  
  # Run opencode and capture full output
  # Run from plugin/ directory to avoid external directory permission prompts
  result=$(cd "$SCRIPT_DIR/.." && cat "$SCRIPT_DIR/ralph-prompt.md" | opencode run -f "$SCRIPT_DIR/PRD.json" -f "$SCRIPT_DIR/progress.txt" --title "Ralph iteration $i")

  echo "$result"

  if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    echo "==============================="
    echo "PRD complete after $i iterations!"
    echo "==============================="
    exit 0
  fi
done

echo "==============================="
echo "Reached max iterations ($MAX_ITERATIONS)"
echo "=============================="
