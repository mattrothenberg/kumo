/**
 * GitLab API utilities for merge request operations
 */

import { Gitlab } from '@gitbeaker/rest';

export const GITLAB_HOST = 'https://gitlab.cfdata.org';
export const GITLAB_KUMO_PATH = 'cloudflare/FE/kumo';

/**
 * Interface for merge request creation parameters
 */
export interface CreateMergeRequestOptions {
  sourceBranch: string;
  targetBranch: string;
  title: string;
  description: string;
  removeSourceBranch?: boolean;
  squash?: boolean;
}

/**
 * Create a merge request using GitLab API
 */
export async function createMergeRequest(
  projectPath: string,
  token: string,
  options: CreateMergeRequestOptions,
): Promise<{ iid: number; web_url: string }> {
  const api = new Gitlab({ host: GITLAB_HOST, token });

  const mergeRequest = await api.MergeRequests.create(
    projectPath,
    options.sourceBranch,
    options.targetBranch,
    options.title,
    {
      description: options.description,
      removeSourceBranch: options.removeSourceBranch ?? true,
      squash: options.squash ?? true,
    },
  );

  return {
    iid: mergeRequest.iid,
    web_url: mergeRequest.web_url,
  };
}
