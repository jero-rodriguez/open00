import { validateConventionalCommit } from './release-guard.js';

if (!validateConventionalCommit(process.env.PR_TITLE)) process.exitCode = 1;
