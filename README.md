# envigorate

Envigorate is a simple module for populating configuration objects with environment variables.

![Codacy grade](https://img.shields.io/codacy/grade/4b5318840ff04cd280aecee02a0052f1?style=plastic) ![Codacy coverage](https://img.shields.io/codacy/coverage/4b5318840ff04cd280aecee02a0052f1?style=plastic) ![npm](https://img.shields.io/npm/v/envigorate?style=plastic) ![GitHub](https://img.shields.io/github/license/cadpnq/envigorate?style=plastic)

## API

### `envigorate(config, env, strict): Record<string, unknown>`

- `config`: `Record<string, unknown>` - An object containing configuration information and possibly variable references.
- `env`: `Record<string, unknown>` - An optional object argument conntaining the variables to be inserted into `config`. Defaults to `process.env`.
- `strict`: `boolean` - An optional argument denoting whether or not an error should be raised when a variable is referenced in `config` that is not present in `env`.

Returns a copy of `config` where values matching the format "${{ FOO }}" are replaced with values from `env`. Optionally throws a `EnvigorateMissingVariableError` if references are made to unknown variables.

### `EnvigorateMissingVariableError`

Error thrown by `envigorate()` when undefined variables are referenced in `config`. Has a `variables` property containing the names of the undefined variables.

## Example

**.env**

```
FOOBAR=123
```

**config.yml**

```yaml
test: ${{ FOOBAR }}
```

**example.ts**

```ts
import 'dotenv/config';
import { cleanEnv, num } from 'envalid';
import { envigorate } from 'envigorate';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';

const config = envigorate(
  load(readFileSync('config.yml').toString()) as Record<string, unknown>,
  cleanEnv(process.env, {
    FOOBAR: num()
  })
);

console.log(config.test); // --> 123
```
