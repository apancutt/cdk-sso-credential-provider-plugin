import { resolve } from 'path';
import { PluginHost } from 'aws-cdk/lib/api/plugin';
import { SsoCredentialProviderSource } from './SsoCredentialProviderSource';
import { PackageJsonConfigurationLoader } from './PackageJsonConfigurationLoader';

export * from './ConfigurationLoader';
export * from './PackageJsonConfigurationLoader';
export * from './SsoCredentialProviderSource';
export * from './types';

export const init = (host: PluginHost): void => {
  host.registerCredentialProviderSource(
    new SsoCredentialProviderSource(
      new PackageJsonConfigurationLoader(resolve(process.cwd(), 'package.json')).load()
    )
  );
};

export const version = '1';
