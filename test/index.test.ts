import { expect } from 'chai';
import { envigorate, EnvigorateMissingVariableError } from '../src/index';

describe('#envigorate()', function () {
  it('should do nothing with empty input', function () {
    const config = {};
    const env = {};

    expect(envigorate(config, env)).to.deep.equal(config);
  });

  it('should throw an error when variables are missing', function () {
    const config = { foo: '${{ TEST }}' };
    const env = {};

    expect(() => {
      envigorate(config, env);
    }).to.throw(EnvigorateMissingVariableError);
  });

  it('should include missing variables in the error', function () {
    const config = { foo: '${{ TEST }}' };
    const env = {};

    try {
      envigorate(config, env);
    } catch (error) {
      expect(error).to.be.instanceOf(EnvigorateMissingVariableError);
      expect(error.variables).to.deep.equal(['TEST']);
    }
  });

  it('should not throw an error when variables are missing and strict mode is off', function () {
    const config = { foo: '${{ TEST }}' };
    const env = {};

    expect(() => {
      envigorate(config, env, false);
    }).to.not.throw(EnvigorateMissingVariableError);
  });

  it('should populate the config with values from the env', function () {
    const config = { foo: '${{ TEST }}' };
    const env = { TEST: 123 };
    const envigorated = { foo: 123 };

    expect(envigorate(config, env)).to.deep.equal(envigorated);
  });

  it('should recurse down the config', function () {
    const config = { foo: { bar: '${{ TEST }}' } };
    const env = { TEST: 123 };
    const envigorated = { foo: { bar: 123 } };

    expect(envigorate(config, env)).to.deep.equal(envigorated);
  });

  it('should ignore normal strings in the config', function () {
    const config = { foo: 'bar' };
    const env = {};

    expect(envigorate(config, env)).to.deep.equal(config);
  });
});
