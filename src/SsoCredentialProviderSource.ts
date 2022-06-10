import { fromSSO } from '@aws-sdk/credential-provider-sso';
import { CredentialProviderSource, Mode } from 'aws-cdk/lib/api/plugin';
import { success } from 'aws-cdk/lib/logging';
import { Credentials } from 'aws-sdk';
import { blue } from 'colors/safe';
import type { AccountId, AccountName, AppName, Configuration, ProfileName } from './types';

/**
 * Provides credentials to the CDK using the SSO credential provider provided by AWS SDK v3.
 */
export class SsoCredentialProviderSource implements CredentialProviderSource {

  // Optimize lookups by restructing the incoming config by keying by account ID
  public readonly config: Record<AccountId, { accountName: AccountName; appName: AppName; profileName: ProfileName }>;

  public readonly name = 'cdk-sso-credential-provider-plugin';

  public constructor(config: Configuration) {
    this.config = Object.entries(config).reduce((acc, [ appName, accounts ]) => ({
      ...acc,
      ...Object.entries(accounts).reduce((acc, [ accountName, accountConfiguration ]) => ({
        ...acc,
        [accountConfiguration.accountId]: {
          accountName,
          appName,
          profileName: accountConfiguration.profileName,
        },
      }), {}),
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

}
