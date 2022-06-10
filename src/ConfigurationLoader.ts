import { AccountId, AccountName, AppName, Configuration, RawConfiguration } from "./types";

/**
 * Base class for loading configuration.
 */
export abstract class ConfigurationLoader {

  protected abstract loadRaw(): RawConfiguration;

  public load<T1 extends AppName = AppName, T2 extends AccountName = AccountName>() {

    const config = this.loadRaw();

    return Object.entries(config).reduce((acc, [ appName, appConfiguration ]) => ({
      ...acc,
      [appName]: Object.entries(appConfiguration).reduce((acc, [ accountName, accountConfiguration ]) => {

        let accountId: AccountId;
        let profileName = `${appName}-${accountName}`;

        if ('string' === typeof accountConfiguration) {
          accountId = accountConfiguration;
        } else {
          accountId = accountConfiguration.accountId;
          if (accountConfiguration.profileName) {
            profileName = accountConfiguration.profileName;
          }
        }

        return {
          ...acc,
          [accountName]: {
            accountId,
            profileName,
          },
        };

      }, {} as Configuration<T1>[T1]),
    }), {} as Configuration<T1, T2>);

  }

}
