export type AppName = string;

export type AccountId = string;

export type AccountName<T extends string = string> = T;

export type ProfileName = string;

export type ExplicitAccountConfiguration = {
  accountId: AccountId;
  profileName?: ProfileName;
};

export type ImplicitAccountConfiguration = AccountId;

export type AnyAccountConfiguration = ExplicitAccountConfiguration | ImplicitAccountConfiguration;

export type AccountConfiguration<T extends AnyAccountConfiguration = AnyAccountConfiguration> = T;

export type AppConfiguration<T1 extends AccountName = AccountName, T2 extends AnyAccountConfiguration = AnyAccountConfiguration> = Record<T1, T2>;

export type Configuration<T1 extends AccountName = AccountName, T2 extends AnyAccountConfiguration = AnyAccountConfiguration> = Record<AppName, AppConfiguration<T1, T2>>;
