#!/usr/bin/env bash
set -e

# Clean OpenCode todos before running Ralph
# This prevents Zero Data Retention errors with stale todo references

echo "Cleaning OpenCode todos for Zero Data Retention compatibility..."

TODO_DIR="/Users/jonnie/.local/share/opencode/storage/todo"

if [ -d "$TODO_DIR" ]; then
  # Count todos before
  TODO_COUNT=$(ls -1 "$TODO_DIR"/*.json 2>/dev/null | wc -l | tr -d ' ')
  
  if [ "$TODO_COUNT" -gt 0 ]; then
    echo "Found $TODO_COUNT todo file(s) - removing to prevent stale references..."
    rm -f "$TODO_DIR"/*.json
    echo "✓ Cleared todos"
  else
    echo "✓ No todos to clear"
  fi
else
  echo "✓ No todo directory found"
fi

echo ""
echo "Ready to run Ralph! Usage:"
echo "  ./ralph.sh <max_iterations>"
echo ""
