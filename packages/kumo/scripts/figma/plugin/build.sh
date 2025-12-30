#!/bin/bash
# Build script for Kumo Figma Plugin
# 
# Figma's plugin runtime uses an older JavaScript engine that doesn't support:
# - Nullish coalescing (??)
# - Optional chaining (?.)
# - Some ES2020+ features
#
# We target ES2017 to ensure compatibility.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KUMO_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"

echo "Building Kumo Figma Plugin..."

cd "$KUMO_DIR"
pnpm exec esbuild "$SCRIPT_DIR/code.ts" \
  --bundle \
  --outfile="$SCRIPT_DIR/code.js" \
  --format=iife \
  --target=es2017 \
  --log-level=info

echo "✅ Build complete: $SCRIPT_DIR/code.js"
