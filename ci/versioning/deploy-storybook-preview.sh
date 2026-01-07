#!/bin/bash
set -euo pipefail

# Storybook Preview Deployment Script
# Uploads a new version to kumo-storybook worker, outputs report artifact

echo "📖 Starting Storybook preview deployment..."

# Verify Cloudflare credentials
if [ -z "$CLOUDFLARE_API_TOKEN" ] || [ -z "$CLOUDFLARE_ACCOUNT_ID" ]; then
  echo "❌ CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID are required"
  exit 1
fi

echo "🔨 Building Storybook..."
cd packages/kumo
pnpm run build:storybook

echo "🚀 Uploading version to kumo-storybook worker..."
echo "  Using wrangler version: $(npx wrangler --version)"

# Try without --x-versions first (wrangler 3.73.0+), fall back to with flag
if ! VERSION_OUTPUT=$(npx wrangler versions upload --message "Preview for ${CI_COMMIT_SHORT_SHA:-local}" 2>&1); then
  echo "⚠️  First attempt failed, trying with --x-versions flag..."
  VERSION_OUTPUT=$(npx wrangler versions upload --x-versions --message "Preview for ${CI_COMMIT_SHORT_SHA:-local}" 2>&1)
fi

echo "$VERSION_OUTPUT"

# Extract Version Preview URL directly from wrangler output
PREVIEW_URL=$(echo "$VERSION_OUTPUT" | grep -oE 'Version Preview URL: https://[^ ]+' | sed 's/Version Preview URL: //')

if [ -z "$PREVIEW_URL" ]; then
  echo "❌ Failed to extract Version Preview URL from wrangler output"
  echo "Full output was:"
  echo "$VERSION_OUTPUT"
  exit 1
fi

echo "✅ Version uploaded successfully"

cd ../..

export STORYBOOK_PREVIEW_URL="$PREVIEW_URL"
echo "✅ Storybook preview available: $STORYBOOK_PREVIEW_URL"

# Output report artifact for the MR reporter job
echo "📄 Writing report artifact..."
pnpm tsx ci/scripts/write-storybook-report.ts

echo "🎉 Storybook preview deployment complete!"
