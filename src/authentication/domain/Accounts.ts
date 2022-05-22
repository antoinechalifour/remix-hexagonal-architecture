import {
  AccountForPasswordResetting,
  UnverifiedAccount,
  VerifiedAccount,
} from "./Account";

export interface Accounts {
  verifiedAccountOfEmail(email: string): Promise<VerifiedAccount>;
  unverifiedAccountOfEmail(email: string): Promise<UnverifiedAccount>;
  accountForPasswordResettingOfEmail(
    theEmail: string
  ): Promise<AccountForPasswordResetting>;
  save(
    account: UnverifiedAccount | VerifiedAccount | AccountForPasswordResetting
  ): Promise<void>;
}
