export function runtimeSmoke({ version, command } = {}) {
  if (version !== '14.367') return { status: 'NOT VERIFIED', reason: 'Foundry build must be exactly 14.367' };
  if (!command) return { status: 'NOT VERIFIED', reason: 'Foundry runtime command is unavailable' };
  return { status: 'NOT VERIFIED', reason: 'External runtime execution must produce a recorded Foundry receipt' };
}

if (process.argv[1]?.endsWith('runtime-smoke.mjs')) console.log(JSON.stringify(runtimeSmoke({ version: process.env.FOUNDRY_VERSION, command: process.env.FOUNDRY_RUNTIME_COMMAND })));
