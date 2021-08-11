# envigorate

Automatically populate your configuration files with environment variables.

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
