import { Account } from "./Account";

export interface Accounts {
  ofEmail(email: string): Promise<Account>;
  save(account: Account): Promise<void>;
}
