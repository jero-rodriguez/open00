import { readdirSync, type Dirent } from 'node:fs';
import { join } from 'node:path';

const conventionalCommit = /^(?:build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(?:\([\w.-]+\))?!?: .+$/;
const forbiddenInput = /(^|\/)(requirements\.txt|CMakeLists\.txt|README\.sh)$|\.(?:md|mdx)$/i;

export interface ReleaseState {
  readonly repository?: unknown;
  readonly release?: unknown;
  readonly authorization?: unknown;
  readonly tag?: unknown;
  readonly sha?: unknown;
  readonly expectedSha?: unknown;
  readonly contentsPrivate?: unknown;
}

export interface RepositorySelector {
  readonly root: string;
  readonly repositoryId: string;
  readonly expectedRepositoryId: string;
}

export interface CommitState {
  readonly taggedTree: string;
  readonly headTree: string;
  readonly staged: boolean;
  readonly commitAll: boolean;
  readonly indexEntries: number;
}

const isRecord = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object';

export const validateConventionalCommit = (message: unknown): boolean => typeof message === 'string' && conventionalCommit.test(message);
export const validateBuildInput = (path: unknown): boolean => typeof path === 'string' && !forbiddenInput.test(path);
export const auditPackageContents = (paths: unknown): boolean => Array.isArray(paths) && paths.every((path) => validateBuildInput(path) && !/(^|\/)adventure(\/|$)/i.test(path));
export const validateRepositorySelector = (selector: unknown): selector is RepositorySelector => {
  if (!isRecord(selector)) return false;
  return typeof selector.root === 'string' && selector.root.startsWith('/') &&
    typeof selector.repositoryId === 'string' && selector.repositoryId === selector.expectedRepositoryId;
};
export const validateCommitState = (state: unknown): state is CommitState => {
  if (!isRecord(state)) return false;
  return typeof state.taggedTree === 'string' && state.taggedTree.length > 0 && state.taggedTree === state.headTree &&
    state.staged === false && state.commitAll === false && Number.isInteger(state.indexEntries) && (state.indexEntries as number) > 0;
};

export function evaluateRelease(state: ReleaseState): { readonly allowed: boolean } {
  return state.repository === 'private' && state.release === 'private' && state.authorization === true &&
    typeof state.tag === 'string' && state.tag.length > 0 && state.sha === state.expectedSha && state.contentsPrivate === true
    ? { allowed: true } : { allowed: false };
}

const packagePaths = (directory: string, prefix: string = directory): string[] => {
  try {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry: Dirent) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? packagePaths(path, join(prefix, entry.name)) : [join(prefix, entry.name)];
    });
  } catch {
    return [];
  }
};

if (process.argv[1]?.endsWith('release-guard.ts')) {
  const contents = packagePaths('dist');
  const result = evaluateRelease({
    repository: process.env.REPOSITORY_VISIBILITY,
    release: process.env.RELEASE_VISIBILITY,
    authorization: process.env.PRIVATE_RELEASE_AUTHORIZED === 'true',
    tag: process.env.GITHUB_REF_NAME,
    sha: process.env.GITHUB_SHA,
    expectedSha: process.env.EXPECTED_RELEASE_SHA,
    contentsPrivate: contents.length > 0 && auditPackageContents(contents) && process.env.PACKAGE_CONTENTS_PRIVATE === 'true',
  });
  if (!result.allowed) process.exitCode = 1;
}
