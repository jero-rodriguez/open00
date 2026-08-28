export interface RuntimeSmokeInput {
  readonly version?: string | undefined;
  readonly command?: string | undefined;
}

export interface RuntimeSmokeResult {
  readonly status: 'NOT VERIFIED';
  readonly reason: string;
}

export function runtimeSmoke({ version, command }: RuntimeSmokeInput = {}): RuntimeSmokeResult {
  if (version !== '14.367') return { status: 'NOT VERIFIED', reason: 'Foundry build must be exactly 14.367' };
  if (!command) return { status: 'NOT VERIFIED', reason: 'Foundry runtime command is unavailable' };
  return { status: 'NOT VERIFIED', reason: 'External runtime execution must produce a recorded Foundry receipt' };
}

if (process.argv[1]?.endsWith('runtime-smoke.ts')) {
  console.log(JSON.stringify(runtimeSmoke({ version: process.env.FOUNDRY_VERSION, command: process.env.FOUNDRY_RUNTIME_COMMAND })));
}
