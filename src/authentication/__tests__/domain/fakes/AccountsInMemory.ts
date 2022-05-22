import { Accounts } from "../../../domain/Accounts";
import {
  AccountForPasswordResetting,
  UnverifiedAccount,
  VerifiedAccount,
} from "../../../domain/Account";
import { InvalidCredentialsError } from "../../../domain/InvalidCredentialsError";
import { AccountAlreadyVerifiedError } from "../../../domain/AccountAlreadyVerifiedError";
import { AccountNotVerifiedError } from "../../../domain/AccountNotVerifiedError";

export class AccountsInMemory implements Accounts {
  private _database = new Map<
    string,
    VerifiedAccount | UnverifiedAccount | AccountForPasswordResetting
  >();

  async verifiedAccountOfEmail(email: string): Promise<VerifiedAccount> {
    const account = this._database.get(email);

    if (account == null) throw new InvalidCredentialsError("Account not found");
    if (account.type !== "verified")
      throw new AccountNotVerifiedError(account.email);

    return account;
  }

  async unverifiedAccountOfEmail(email: string): Promise<UnverifiedAccount> {
    const account = this._database.get(email);

    if (account == null) throw new InvalidCredentialsError("Account not found");
    if (account.type !== "unverified")
      throw new AccountAlreadyVerifiedError(account.email);

    return account;
  }

  async accountForPasswordResettingOfEmail(
    email: string
  ): Promise<AccountForPasswordResetting> {
    const account = this._database.get(email);

    if (account == null) throw new Error("Account not found");
    if (account.type !== "password-reset") throw new Error("TODO");

    return account;
  }

  async save(account: VerifiedAccount | UnverifiedAccount): Promise<void> {
    this._database.set(account.email, account);
  }
}
