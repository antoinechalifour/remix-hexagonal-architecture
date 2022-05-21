import { Accounts } from "../../../domain/Accounts";
import { UnverifiedAccount, VerifiedAccount } from "../../../domain/Account";
import { InvalidCredentialsError } from "../../../domain/InvalidCredentialsError";
import { AccountAlreadyVerifiedError } from "../../../domain/AccountAlreadyVerifiedError";
import { AccountNotVerifiedError } from "../../../domain/AccountNotVerifiedError";

export class AccountsInMemory implements Accounts {
  private _database = new Map<string, VerifiedAccount | UnverifiedAccount>();

  async verifiedAccountOfEmail(email: string): Promise<VerifiedAccount> {
    const account = this._database.get(email);

    if (!account) throw new InvalidCredentialsError("Account not found");
    if (!account.verified) throw new AccountNotVerifiedError(account.email);

    return account;
  }

  async unverifiedAccountOfEmail(email: string): Promise<UnverifiedAccount> {
    const account = this._database.get(email);

    if (!account) throw new InvalidCredentialsError("Account not found");
    if (account.verified) throw new AccountAlreadyVerifiedError(account.email);

    return account;
  }

  async save(account: VerifiedAccount | UnverifiedAccount): Promise<void> {
    this._database.set(account.email, account);
  }
}
