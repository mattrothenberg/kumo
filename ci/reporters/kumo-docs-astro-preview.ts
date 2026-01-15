/**
 * Kumo Docs Astro Preview Reporter
 *
 * Reports the deployed kumo-docs-astro preview URL.
 */

import type { CIContext, ReportItem, Reporter } from "./types";

export const kumoDocsAstroPreviewReporter: Reporter = {
  id: "kumo-docs-astro-preview",
  name: "Kumo Docs (Astro) Preview",

  async collect(context: CIContext): Promise<ReportItem | null> {
    const { kumoDocsAstroPreviewUrl, shortSha } = context;

    if (!kumoDocsAstroPreviewUrl) {
      return null;
    }

    const content = `**Preview URL:** [${kumoDocsAstroPreviewUrl}](${kumoDocsAstroPreviewUrl})

This preview deployment (\`${shortSha}\`) contains the latest Astro documentation site changes.`;

    return {
      id: "kumo-docs-astro-preview",
      title: "📖 Documentation Preview (Astro)",
      priority: 25,
      content,
      success: true,
    };
  },
};
