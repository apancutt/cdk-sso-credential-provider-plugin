import type { Configuration } from './types';

/**
 * Base class for loading configuration.
 */
export abstract class ConfigurationLoader {

  public abstract load(): Configuration;

}
