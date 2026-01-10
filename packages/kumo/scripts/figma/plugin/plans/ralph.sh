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

# Function to clean OpenCode storage for Zero Data Retention compatibility
# In ZDR orgs, resource IDs (rs_...) become invalid after sessions end
clean_opencode_cache() {
  # Clean LOCAL project cache
  LOCAL_OPENCODE="$SCRIPT_DIR/../.opencode"
  if [ -d "$LOCAL_OPENCODE" ]; then
    rm -rf "$LOCAL_OPENCODE"
  fi

  # Clean global storage (where rs_ IDs are cached in part/ files)
  STORAGE_DIR="$HOME/.local/share/opencode/storage"
  if [ -d "$STORAGE_DIR" ]; then
    rm -rf "$STORAGE_DIR/todo" "$STORAGE_DIR/session_diff" "$STORAGE_DIR/part" "$STORAGE_DIR/message" "$STORAGE_DIR/session" 2>/dev/null || true
  fi
}

MAX_ITERATIONS=$1

for ((i=1; i<=MAX_ITERATIONS; i++)); do
  echo "==============================="
  echo "Ralph iteration $i of $MAX_ITERATIONS"
  echo "==============================="
  
  # Clean cache BEFORE each iteration to prevent ZDR errors
  # Previous iteration's rs_ IDs are deleted server-side by ZDR
  echo "Cleaning OpenCode cache (ZDR compatibility)..."
  clean_opencode_cache
  echo "✓ Cache cleaned"
  
  # Run opencode and capture full output
  # Note: Not using --continue to avoid session persistence issues in Zero Data Retention orgs
  # Run from plugin/ directory to avoid external directory permission prompts
  result=$(cd "$SCRIPT_DIR/.." && cat "$SCRIPT_DIR/ralph-prompt.md" | opencode run -f "$SCRIPT_DIR/PRD.json" -f "$SCRIPT_DIR/SPEC.md" -f "$SCRIPT_DIR/progress.txt" --title "Ralph iteration $i")

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
