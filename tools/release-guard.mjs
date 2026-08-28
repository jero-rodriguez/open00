import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const conventionalCommit = /^(?:build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(?:\([\w.-]+\))?!?: .+$/;
const forbiddenInput = /(^|\/)(requirements\.txt|CMakeLists\.txt|README\.sh)$|\.(?:md|mdx)$/i;

export const validateConventionalCommit = (message) => conventionalCommit.test(message);
export const validateBuildInput = (path) => !forbiddenInput.test(path);
export const auditPackageContents = (paths) => Array.isArray(paths) && paths.every((path) => validateBuildInput(path) && !/(^|\/)adventure(\/|$)/i.test(path));
export const validateRepositorySelector = (selector) => Boolean(
  selector && typeof selector === 'object' && typeof selector.root === 'string' && selector.root.startsWith('/') &&
  selector.repositoryId === selector.expectedRepositoryId,
);
export const validateCommitState = (state) => Boolean(
  state && state.taggedTree && state.taggedTree === state.headTree && state.staged === false &&
  state.commitAll === false && Number.isInteger(state.indexEntries) && state.indexEntries > 0,
);
export function evaluateRelease(state) {
  return state.repository === 'private' && state.release === 'private' && state.authorization === true &&
    typeof state.tag === 'string' && state.tag.length > 0 && state.sha === state.expectedSha && state.contentsPrivate === true
    ? { allowed: true } : { allowed: false };
}

const packagePaths = (directory, prefix = directory) => {
  try {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? packagePaths(path, join(prefix, entry.name)) : [join(prefix, entry.name)];
    });
  } catch { return []; }
};

if (process.argv[1]?.endsWith('release-guard.mjs')) {
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
