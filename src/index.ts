import { deepCopy } from 'deep-copy-ts';

export class EnvigorateMissingVariableError extends Error {
  variables: string[] = [];

  constructor(variables: string[]) {
    super('Missing variables');
    this.variables = variables;
  }
}

export function envigorate(
  config: Record<string, unknown>,
  env: Record<string, unknown> = process.env,
  strict = true
): Record<string, unknown> {
  return doEnvigorate(deepCopy(config), env, strict);
}

function doEnvigorate(
  config: Record<string, unknown>,
  env: Record<string, unknown>,
  strict: boolean,
  missingVariables: string[] = []
): Record<string, unknown> {
  for (const [key, value] of Object.entries(config)) {
    switch (typeof value) {
      case 'object':
        doEnvigorate(
          value as Record<string, unknown>,
          env,
          false,
          missingVariables
        );
        break;
      case 'string': {
        const match = /\$\s*{\s*{\s*(\S+)\s*}\s*}/.exec(value);
        if (match) {
          const variable = match[1];
          if (env[variable] === undefined) {
            missingVariables.push(variable);
          } else {
            config[key] = env[variable];
          }
        }
      }
    }
  }

  if (strict && missingVariables.length > 0) {
    throw new EnvigorateMissingVariableError(missingVariables);
  }

  return config;
}
