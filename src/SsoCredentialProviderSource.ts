import { fromSSO } from '@aws-sdk/credential-provider-sso';
import type { CredentialProviderSource, Mode } from 'aws-cdk/lib/api'; // CDK2 no longer exports these types from 'aws-cdk'
import { success } from 'aws-cdk/lib/logging';
import { Credentials } from 'aws-sdk'; // CDK1 and 2 both require an instance of Credentials from aws-sdk v2
import { blue } from 'colors/safe';
import type { AccountConfiguration, AccountId, AccountName, AppName, Configuration, ExplicitAccountConfiguration, ImplicitAccountConfiguration, ProfileName } from './types';

/**
 * Provides credentials to the CDK using the SSO credential provider provided by AWS SDK v3.
 */
export class SsoCredentialProviderSource implements CredentialProviderSource {

  public readonly config: Record<AccountId, { appName: AppName, accountName: AccountName, profileName: ProfileName }>;
  public readonly name = 'cdk-sso-credential-provider-plugin';

  public constructor(config: Configuration) {
    // Optimize the incoming config by indexing by account ID
    this.config = Object.entries(config).reduce((acc, [ appName, accounts ]) => ({
      ...acc,
      ...Object.entries(accounts).reduce((acc2, [ accountName, accountConfiguration ]) => {

        let accountId: AccountId;
        let profileName: ProfileName;

        if (SsoCredentialProviderSource.isImplicitAccountConfiguration(accountConfiguration)) {
          accountId = accountConfiguration;
          profileName = SsoCredentialProviderSource.inferProfileName(appName, accountName);
        } else {
          accountId = accountConfiguration.accountId;
          profileName = accountConfiguration.profileName ?? SsoCredentialProviderSource.inferProfileName(appName, accountName);
        }

        return {
          ...acc2,
          [accountId]: {
            accountName,
            appName,
            profileName,
          },
        };

      }, {}),
    }), {});
  }

  public async isAvailable(): Promise<boolean> {
    return Object.keys(this.config).length > 0;
  }

  public async canProvideCredentials(accountId: AccountId): Promise<boolean> {
    return accountId in this.config;
  }

  public async getProvider(accountId: AccountId, mode: Mode): Promise<Credentials> { // mode arg is unused since we're not assuming roles
    const { accountName, appName, profileName } = this.config[accountId];
    success(` 🔑  Obtaining ${blue(appName)} credentials for account ${blue(accountId)} (${blue(accountName)}) using SSO profile ${blue(profileName)}`);
    const { accessKeyId, secretAccessKey, sessionToken } = await fromSSO({ profile: profileName })();
    return new Credentials(accessKeyId, secretAccessKey, sessionToken);
  }

  protected static isExplicitAccountConfiguration(config: AccountConfiguration): config is ExplicitAccountConfiguration {
    return !this.isImplicitAccountConfiguration(config);
  }

  protected static isImplicitAccountConfiguration(config: AccountConfiguration): config is ImplicitAccountConfiguration {
    return 'string' === typeof config;
  }

  protected static inferProfileName(appName: AppName, accountName: AccountName): ProfileName {
    return `${appName}-${accountName}`;
  }

}
