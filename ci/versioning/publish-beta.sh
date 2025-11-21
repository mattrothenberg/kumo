#!/bin/bash
set -e

# Beta release script for CI
# Versions, builds, publishes, verifies, and posts MR comment

echo "🚀 Starting beta release process..."

# Configure npm registry authentication
cat > ~/.npmrc << EOF
@cloudflare:registry=https://registry-gateway.cloudflare-ui.workers.dev
//registry-gateway.cloudflare-ui.workers.dev/:_authToken=${NPM_TOKEN}
EOF

# Configure git for commits
git config --global user.email "ci@cloudflare.com"
git config --global user.name "Kumo CI"

# Run the versioning step first
echo "📝 Versioning packages..."
pnpm run version:beta

# Build the package before publishing
echo "🔨 Building package..."
cd packages/kumo && pnpm run build && cd ../..

# Run the publish step after versioning and building
echo "📦 Publishing to npm..."
pnpm run release:beta

# Get the published version
NEW_VERSION=$(node -p "require('./packages/kumo/package.json').version")
PACKAGE_NAME="${PACKAGE_NAME:-@cloudflare/kumo}"

echo "✅ Published version: $NEW_VERSION"

# Verify the version was published successfully
echo "🔍 Verifying publication..."
sleep 45

AVAILABLE_VERSIONS=$(pnpm view ${PACKAGE_NAME} versions --json 2>/dev/null || echo '[]')
echo "Checking for version: $NEW_VERSION"

if echo "$AVAILABLE_VERSIONS" | grep -F "\"$NEW_VERSION\"" > /dev/null; then
  echo "✅ Version $NEW_VERSION successfully published and verified in npm registry"
elif pnpm view ${PACKAGE_NAME}@${NEW_VERSION} version > /dev/null 2>&1; then
  echo "✅ Version $NEW_VERSION successfully published and verified via direct lookup"
else
  echo "❌ Version $NEW_VERSION not found in npm registry after publishing"
  echo "Searched for: $NEW_VERSION"
  echo "Last 10 available versions:"
  echo "$AVAILABLE_VERSIONS" | grep -o '"[^"]*"' | tail -10
  echo ""
  echo "Note: The version might exist but verification failed due to registry propagation delay"
  echo "Manual verification: pnpm view ${PACKAGE_NAME}@${NEW_VERSION}"
  exit 1
fi

# Post MR comment only if in MR context
if [ -n "$CI_MERGE_REQUEST_IID" ]; then
  echo "💬 Posting MR comment..."
  
  # Use node to generate proper JSON payload
  JSON_PAYLOAD=$(node -e "
    const body = \`🎉 **Beta Release Published**

📦 \\\`${PACKAGE_NAME}@${NEW_VERSION}\\\` has been published to the npm registry.

**Installation:**
\\\`\\\`\\\`bash
npm install ${PACKAGE_NAME}@${NEW_VERSION}
# or
pnpm add ${PACKAGE_NAME}@${NEW_VERSION}
\\\`\\\`\\\`

**Testing:** You can now test this beta version in your projects before the final release.\`;
    console.log(JSON.stringify({ body }));
  ")
  
  curl --request POST \
    --header "PRIVATE-TOKEN: $GITLAB_API_TOKEN" \
    --header "Content-Type: application/json" \
    --data "$JSON_PAYLOAD" \
    "$CI_API_V4_URL/projects/$CI_PROJECT_ID/merge_requests/$CI_MERGE_REQUEST_IID/notes" || echo "⚠️  Failed to post MR comment"
  
  echo "✅ MR comment posted successfully"
else
  echo "ℹ️  Skipping MR comment (not in MR context)"
fi

echo "🎉 Beta release complete!"
