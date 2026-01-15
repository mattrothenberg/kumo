/**
 * Reporter Registry
 *
 * Central registry of all available reporters.
 * Add new reporters here to include them in MR comments.
 */

import type { Reporter } from "./types";
import { npmReleaseReporter } from "./npm-release";
import { storybookPreviewReporter } from "./storybook-preview";
import { kumoDocsPreviewReporter } from "./kumo-docs-preview";
import { kumoDocsAstroPreviewReporter } from "./kumo-docs-astro-preview";

/**
 * All registered reporters, executed in order
 */
export const reporters: Reporter[] = [
  npmReleaseReporter,
  storybookPreviewReporter,
  kumoDocsPreviewReporter,
  kumoDocsAstroPreviewReporter,
];

export * from "./types";
export {
  REPORTS_DIR,
  writeReportArtifact,
  readReportArtifacts,
  buildContextFromEnv,
} from "./types";
export { npmReleaseReporter } from "./npm-release";
export { storybookPreviewReporter } from "./storybook-preview";
export { kumoDocsPreviewReporter } from "./kumo-docs-preview";
export { kumoDocsAstroPreviewReporter } from "./kumo-docs-astro-preview";
