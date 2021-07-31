export type AppName = string;

export type AccountId = string;

export type AccountName = string;

export type ProfileName = string;

export type ExplicitAccountConfiguration = {
  accountId: AccountId;
  profileName?: ProfileName;
};

export type ImplicitAccountConfiguration = AccountId;

export type AccountConfiguration = ExplicitAccountConfiguration | ImplicitAccountConfiguration;

export type AppConfiguration = Record<AccountName, AccountConfiguration>;

export type Configuration = Record<AppName, AppConfiguration>;
