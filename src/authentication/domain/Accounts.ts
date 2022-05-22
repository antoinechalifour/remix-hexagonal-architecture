import {
  AccountForgotPassword,
  UnverifiedAccount,
  VerifiedAccount,
} from "./Account";

export interface Accounts {
  verifiedAccountOfEmail(email: string): Promise<VerifiedAccount>;
  unverifiedAccountOfEmail(email: string): Promise<UnverifiedAccount>;
  accountForgotPasswordOfEmail(email: string): Promise<AccountForgotPassword>;
  save(
    account: UnverifiedAccount | VerifiedAccount | AccountForgotPassword
  ): Promise<void>;
}
