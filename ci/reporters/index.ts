/**
 * Reporter Registry
 *
 * Central registry of all available reporters.
 * Add new reporters here to include them in MR comments.
 */

import type { Reporter } from './types';
import { npmReleaseReporter } from './npm-release';
import { storybookPreviewReporter } from './storybook-preview';

/**
 * All registered reporters, executed in order
 */
export const reporters: Reporter[] = [
  npmReleaseReporter,
  storybookPreviewReporter,
];

export * from './types';
export {
  REPORTS_DIR,
  writeReportArtifact,
  readReportArtifacts,
  buildContextFromEnv,
} from './types';
export { npmReleaseReporter } from './npm-release';
export { storybookPreviewReporter } from './storybook-preview';
