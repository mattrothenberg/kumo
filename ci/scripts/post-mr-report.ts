#!/usr/bin/env tsx

/**
 * Post MR Report
 *
 * Collects report artifacts from upstream CI jobs and posts
 * a consolidated comment to the merge request.
 *
 * This script should run as the final job in the pipeline,
 * after all jobs that produce report artifacts.
 *
 * Usage: pnpm tsx ci/scripts/post-mr-report.ts
 *
 * Required environment variables:
 * - CI_MERGE_REQUEST_IID: Merge request IID
 * - CI_PROJECT_ID: GitLab project ID
 * - CI_API_V4_URL: GitLab API URL
 * - GITLAB_API_TOKEN: GitLab API token
 *
 * Report artifacts are read from: ci/reports/*.json
 */

import { readReportArtifacts, buildContextFromEnv } from '../reporters';
import { buildMarkdownComment, postMRComment } from '../utils/mr-reporter';

async function main() {
  console.log('📋 Collecting report artifacts from upstream jobs...');

  const context = buildContextFromEnv();

  if (!context.mrIid) {
    console.log('ℹ️  Not in MR context, skipping report');
    return;
  }

  // Read all report artifacts from upstream jobs
  const { items, failures } = readReportArtifacts();

  console.log(`  Found ${items.length} report artifact(s)`);
  if (failures.length > 0) {
    console.log(`  ⚠️  ${failures.length} artifact(s) failed to load:`);
    failures.forEach((f) => console.log(`    - ${f}`));
  }

  if (items.length === 0) {
    console.log('ℹ️  No report artifacts found, skipping comment');
    return;
  }

  for (const item of items) {
    console.log(`  → ${item.title} (${item.id})`);
  }

  console.log(`\n📝 Building comment with ${items.length} section(s)...`);

  // Build and post the comment
  const comment = buildMarkdownComment(items, failures);
  await postMRComment(context, comment);

  console.log('🎉 MR report posted successfully');
}

main().catch((error) => {
  console.error('❌ Failed to post MR report:', error);
  process.exit(1);
});
