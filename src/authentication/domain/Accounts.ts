import { UnverifiedAccount, VerifiedAccount } from "./Account";

export interface Accounts {
  verifiedAccountOfEmail(email: string): Promise<VerifiedAccount>;
  save(account: UnverifiedAccount | VerifiedAccount): Promise<void>;
}
