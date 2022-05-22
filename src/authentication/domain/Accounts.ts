import {
  AccountForPasswordResetting,
  UnverifiedAccount,
  VerifiedAccount,
} from "./Account";

export interface Accounts {
  verifiedAccountOfEmail(email: string): Promise<VerifiedAccount>;
  unverifiedAccountOfEmail(email: string): Promise<UnverifiedAccount>;
  accountForPasswordResettingOfEmail(
    email: string
  ): Promise<AccountForPasswordResetting>;
  save(
    account: UnverifiedAccount | VerifiedAccount | AccountForPasswordResetting
  ): Promise<void>;
}
