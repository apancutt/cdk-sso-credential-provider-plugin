import { resolve } from 'path';
import { PluginHost } from 'aws-cdk/lib/plugin'; // CDK2 no longer exports these types from 'aws-cdk'
import { SsoCredentialProviderSource } from './SsoCredentialProviderSource';
import { PackageJsonConfigurationLoader } from './PackageJsonConfigurationLoader';

export const init = (host: PluginHost): void => {
  host.registerCredentialProviderSource(
    new SsoCredentialProviderSource(
      new PackageJsonConfigurationLoader(resolve(process.cwd(), 'package.json')).load()
    )
  );
};

export const version = '1';
