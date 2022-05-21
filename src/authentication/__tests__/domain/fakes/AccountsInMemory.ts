import { Accounts } from "../../../domain/Accounts";
import { UnverifiedAccount, VerifiedAccount } from "../../../domain/Account";
import { InvalidCredentialsError } from "../../../domain/InvalidCredentialsError";

export class AccountsInMemory implements Accounts {
  private _database = new Map<string, VerifiedAccount | UnverifiedAccount>();

  async verifiedAccountOfEmail(email: string): Promise<VerifiedAccount> {
    const account = this._database.get(email);

    if (!account) throw new InvalidCredentialsError("Account not found");
    if (!account.verified) throw new Error("Account not verified");

    return account;
  }

  async unverifiedAccountOfEmail(email: string): Promise<UnverifiedAccount> {
    const account = this._database.get(email);

    if (!account) throw new InvalidCredentialsError("Account not found");
    if (account.verified) throw new Error("Account is verified verified");

    return account;
  }

  async save(account: VerifiedAccount | UnverifiedAccount): Promise<void> {
    this._database.set(account.email, account);
  }
}
