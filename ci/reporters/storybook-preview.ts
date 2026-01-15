/**
 * Storybook Preview Reporter
 *
 * Reports the deployed Storybook preview URL.
 */

import type { CIContext, ReportItem, Reporter } from "./types";

export const storybookPreviewReporter: Reporter = {
  id: "storybook-preview",
  name: "Storybook Preview",

  async collect(context: CIContext): Promise<ReportItem | null> {
    const { storybookPreviewUrl, shortSha } = context;

    if (!storybookPreviewUrl) {
      return null;
    }

    const content = `**Preview URL:** [${storybookPreviewUrl}](${storybookPreviewUrl})

This preview deployment (\`${shortSha}\`) contains the latest component changes from this MR.`;

    return {
      id: "storybook-preview",
      title: "📖 Storybook Preview",
      priority: 20,
      content,
      success: true,
    };
  },
};
