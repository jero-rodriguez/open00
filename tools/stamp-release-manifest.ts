import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryPattern = /^(?<owner>[A-Za-z0-9](?:[A-Za-z0-9.-]{0,38}[A-Za-z0-9])?)\/(?<name>[A-Za-z0-9](?:[A-Za-z0-9._-]{0,98}[A-Za-z0-9])?)$/;
const versionPattern = /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

type ReleaseOption = '--dist' | '--repository' | '--tag' | '--version';

export interface ReleaseStampOptions {
  readonly dist: string;
  readonly repository: string;
  readonly tag: string;
  readonly version: string;
}

export type Manifest = Record<string, unknown>;

const releaseOptions: readonly ReleaseOption[] = ['--dist', '--repository', '--tag', '--version'];
const isReleaseOption = (value: string): value is ReleaseOption => releaseOptions.includes(value as ReleaseOption);
const isManifest = (value: unknown): value is Manifest => value !== null && typeof value === 'object' && !Array.isArray(value);

function parseArguments(arguments_: readonly string[]): ReleaseStampOptions {
  const options: Partial<Record<ReleaseOption, string>> = {};
  for (let index = 0; index < arguments_.length; index += 2) {
    const option = arguments_[index];
    const value = arguments_[index + 1];
    if (option === undefined || !isReleaseOption(option) || value === undefined || options[option] !== undefined) {
      throw new Error('Expected each of --dist, --repository, --tag, and --version exactly once.');
    }
    options[option] = value;
  }
  const dist = options['--dist'];
  const repository = options['--repository'];
  const tag = options['--tag'];
  const version = options['--version'];
  if (dist === undefined || repository === undefined || tag === undefined || version === undefined) {
    throw new Error('Expected --dist, --repository, --tag, and --version.');
  }
  return { dist, repository, tag, version };
}

function validateReleaseIdentity({ repository, tag, version }: ReleaseStampOptions): void {
  if (!repositoryPattern.test(repository)) throw new Error('Repository must be an explicit owner/name identifier.');
  if (!versionPattern.test(version)) throw new Error('Version must be a semantic version without a leading v.');
  if (tag !== `v${version}`) throw new Error('Tag must exactly match the version as v<version>.');
}

export function stampReleaseManifest({ dist, repository, tag, version }: ReleaseStampOptions): Manifest {
  if (dist.length === 0) throw new Error('Distribution directory is required.');
  validateReleaseIdentity({ dist, repository, tag, version });

  const manifestPath = resolve(dist, 'system.json');
  let manifest: unknown;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as unknown;
  } catch {
    throw new Error(`Unable to read a valid distribution manifest at ${manifestPath}.`);
  }
  if (!isManifest(manifest) || manifest.id !== 'open00') {
    throw new Error('Distribution manifest must be the open00 system manifest.');
  }

  const releaseUrl = `https://github.com/${repository}/releases/download/${tag}`;
  const stampedManifest: Manifest = {
    ...manifest,
    version,
    manifest: `${releaseUrl}/system.json`,
    download: `${releaseUrl}/open00.zip`,
  };
  writeFileSync(manifestPath, `${JSON.stringify(stampedManifest, null, 2)}\n`);
  return stampedManifest;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    stampReleaseManifest(parseArguments(process.argv.slice(2)));
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : 'Unable to stamp release manifest.');
    process.exitCode = 1;
  }
}
