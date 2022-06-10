export type AppName = string;

export type AccountId = string;

export type AccountName<T extends string = string> = T;

export type ProfileName = string;

export type RawConfiguration<T1 extends AppName = AppName, T2 extends AccountName = AccountName> = Record<T1, Record<T2, string | {
  accountId: AccountId;
  profileName?: ProfileName;
}>>;

export type Configuration<T1 extends AppName = AppName, T2 extends AccountName = AccountName> = Record<T1, Record<T2, {
  accountId: AccountId;
  profileName: ProfileName;
}>>;
