import { execSync, execFileSync } from 'child_process';

/**
 * Git operations utility for CI scripts
 * Provides reusable functions for working with Git refs and file changes
 */

export interface GitRefs {
  baseRef: string | undefined;
  headRef: string;
}

export interface ChangedFilesOptions {
  /** Base directory to filter files by (e.g., 'packages/kumo') */
  filterPath?: string;
  /** Working directory for git commands */
  cwd?: string;
}

/**
 * Gets the base and head refs for the current CI context
 * Uses GitLab CI variables
 */
export function getGitRefs(): GitRefs {
  const baseRef = process.env.CI_MERGE_REQUEST_DIFF_BASE_SHA;
  const headRef = process.env.CI_MERGE_REQUEST_DIFF_TARGET_SHA || 'HEAD';
  
  return { baseRef, headRef };
}

/**
 * Gets the list of changed files between base and head refs
 * Returns an array of file paths, or null if no changes found
 */
export function getChangedFiles(options: ChangedFilesOptions = {}): string[] | null {
  try {
    const { baseRef, headRef } = getGitRefs();
    
    if (!baseRef) {
      console.warn('⚠️  Warning: Could not determine base ref for file changes');
      return null;
    }

    const changedFiles = execSync(
      `git diff --name-only ${baseRef}...${headRef}`,
      { 
        encoding: 'utf8',
        cwd: options.cwd || process.cwd()
      }
    ).trim();

    if (!changedFiles) {
      return [];
    }

    const files = changedFiles.split('\n');
    
    // Apply path filter if specified
    if (options.filterPath) {
      return files.filter(file => file.startsWith(`${options.filterPath}/`));
    }
    
    return files;
  } catch (error) {
    console.warn('⚠️  Warning: Could not get changed files');
    console.warn(`Error: ${error}`);
    return null;
  }
}

/**
 * Checks if any files have changed in a specific directory path
 * Returns true if changes exist, false if no changes, null if unable to determine
 */
export function hasChangesInPath(path: string, options: Omit<ChangedFilesOptions, 'filterPath'> = {}): boolean | null {
  const changedFiles = getChangedFiles({ ...options, filterPath: path });
  
  if (changedFiles === null) {
    return null; // Unable to determine
  }
  
  return changedFiles.length > 0;
}

/**
 * Gets newly added files in a specific directory between base and head refs
 * Returns file paths with their status (A = Added, M = Modified, D = Deleted, etc.)
 */
export function getNewlyAddedFiles(directory: string, options: ChangedFilesOptions = {}): Array<{ status: string; path: string }> {
  try {
    const { baseRef, headRef } = getGitRefs();
    
    if (!baseRef) {
      console.warn('Warning: Could not determine base ref for newly added files');
      return [];
    }

    // Use execFileSync with array arguments to prevent command injection
    // This passes arguments directly to git without shell interpretation
    const newFiles = execFileSync(
      'git',
      ['diff', '--name-status', `${baseRef}...${headRef}`, '--', directory],
      { 
        encoding: 'utf8',
        cwd: options.cwd || process.cwd()
      }
    ).trim();

    if (!newFiles) {
      return [];
    }

    const files: Array<{ status: string; path: string }> = [];
    const lines = newFiles.split('\n');

    for (const line of lines) {
      const [status, filePath] = line.split('\t');
      if (status && filePath) {
        files.push({ status, path: filePath });
      }
    }

    return files;
  } catch (error) {
    console.warn('Warning: Could not get newly added files');
    console.warn(`Error: ${error}`);
    return [];
  }
}

/**
 * Checks if we're running in a merge request context
 * Supports multiple detection methods for different CI scenarios
 */
export function isMergeRequestContext(): boolean {
  // Check if we're in a merge request context
  // We can detect MR context through multiple indicators:
  // 1. Direct MR pipeline: CI_PIPELINE_SOURCE === 'merge_request_event'
  // 2. Scheduled/downstream from MR: CI_MERGE_REQUEST_IID is set
  // 3. Manual override: CI_FORCE_MR_VALIDATION === 'true'
  return process.env.CI_PIPELINE_SOURCE === 'merge_request_event' || 
         process.env.CI_MERGE_REQUEST_IID !== undefined ||
         process.env.CI_FORCE_MR_VALIDATION === 'true';
}

/**
 * Logs the detected merge request context for transparency
 */
export function logMergeRequestContext(): void {
  if (process.env.CI_PIPELINE_SOURCE === 'merge_request_event') {
    console.log('Detected MR context: Direct merge request pipeline');
  } else if (process.env.CI_MERGE_REQUEST_IID) {
    console.log(`Detected MR context: Scheduled pipeline from MR #${process.env.CI_MERGE_REQUEST_IID}`);
  } else if (process.env.CI_FORCE_MR_VALIDATION === 'true') {
    console.log('Detected MR context: Manual validation override');
  }
}
