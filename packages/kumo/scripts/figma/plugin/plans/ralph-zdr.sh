#!/usr/bin/env bash
set -e

# Ralph ZDR - Zero Data Retention compatible version
# This version clears ALL OpenCode storage before each run
# Usage: ./ralph-zdr.sh <max_iterations>

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -z "$1" ]; then
  echo "Usage: $0 <max_iterations>"
  echo "Example: $0 10"
  exit 1
fi

# AGGRESSIVE cleanup for Zero Data Retention orgs
# This removes ALL OpenCode cached state to prevent errors from deleted resources
echo "⚠️  AGGRESSIVE CLEANUP: Removing ALL OpenCode storage..."
echo "This will clear your OpenCode session history, todos, and caches."
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 1
fi

STORAGE_DIR="$HOME/.local/share/opencode/storage"

if [ -d "$STORAGE_DIR" ]; then
  echo "Cleaning storage directories..."
  
  # Clean everything except project metadata
  for dir in todo session_diff part message session; do
    if [ -d "$STORAGE_DIR/$dir" ]; then
      rm -rf "$STORAGE_DIR/$dir"
      mkdir -p "$STORAGE_DIR/$dir"
      echo "  ✓ Cleaned $dir"
    fi
  done
  
  echo "✓ Storage cleaned"
else
  echo "✓ No storage directory found"
fi
echo ""

MAX_ITERATIONS=$1

for ((i=1; i<=MAX_ITERATIONS; i++)); do
  echo "==============================="
  echo "Ralph iteration $i of $MAX_ITERATIONS"
  echo "==============================="
  
  # Run opencode with unique session title
  result=$(cat "$SCRIPT_DIR/ralph-prompt.md" | opencode run --model openai/gpt-5.2 -f "$SCRIPT_DIR/PRD.json" -f "$SCRIPT_DIR/SPEC.md" -f "$SCRIPT_DIR/progress.txt" --title "Ralph ZDR iteration $i")

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
