import { UnverifiedAccount, VerifiedAccount } from "./Account";

export interface Accounts {
  verifiedAccountOfEmail(email: string): Promise<VerifiedAccount>;
  unverifiedAccountOfEmail(email: string): Promise<UnverifiedAccount>;
  save(account: UnverifiedAccount | VerifiedAccount): Promise<void>;
}
