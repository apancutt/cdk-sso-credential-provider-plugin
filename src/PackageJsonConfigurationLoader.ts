import { blue } from 'colors/safe';
import { existsSync, readFileSync } from 'fs';
import { ConfigurationLoader } from './ConfigurationLoader';
import type { Configuration } from './types';

/**
 * Loads configuration from a package.json file.
 */
export class PackageJsonConfigurationLoader extends ConfigurationLoader {

  static KEY = 'ssoCredentialProvider';

  public path: string;

  public constructor(path: PackageJsonConfigurationLoader['path']) {
    super();
    this.path = path;
  }

  public load(): Configuration {
    if (!existsSync(this.path)) {
      throw new Error(`A package.json was not found at ${blue(this.path)}`);
    }
    const config: unknown = (JSON.parse(readFileSync(this.path, 'utf8')) ?? {})[PackageJsonConfigurationLoader.KEY];
    if (undefined === config || null === config) {
      throw new Error(`An entry for ${blue(PackageJsonConfigurationLoader.KEY)} was not found in your package.json file`);
    }
    if ('object' !== typeof config) {
      throw new Error(`Configuration of ${blue(PackageJsonConfigurationLoader.KEY)} in your package.json file is invalid`);
    }
    return config as Configuration;
  }

}
