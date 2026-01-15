#!/usr/bin/env tsx

/**
 * Write Storybook Preview Report Artifact
 *
 * Outputs a report artifact for the Storybook preview deployment.
 * Called by deploy-storybook-preview.sh after successful deployment.
 *
 * Required environment variables:
 * - STORYBOOK_PREVIEW_URL: Deployed preview URL
 * - CI_COMMIT_SHA or CI_COMMIT_SHORT_SHA: Commit SHA
 */

import {
  writeReportArtifact,
  storybookPreviewReporter,
  buildContextFromEnv,
} from "../reporters";

async function main() {
  const context = buildContextFromEnv();

  if (!context.storybookPreviewUrl) {
    console.error("❌ STORYBOOK_PREVIEW_URL environment variable is required");
    process.exit(1);
  }

  const item = await storybookPreviewReporter.collect(context);

  if (item) {
    writeReportArtifact(item);
    console.log("✅ Storybook preview report artifact written");
  } else {
    console.log("ℹ️  No report item generated");
  }
}

main().catch((error) => {
  console.error("❌ Failed to write Storybook report:", error);
  process.exit(1);
});
