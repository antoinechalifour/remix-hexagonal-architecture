import { Accounts } from "../../../domain/Accounts";
import {
  AccountForgotPassword,
  UnverifiedAccount,
  VerifiedAccount,
} from "../../../domain/Account";
import { InvalidCredentialsError } from "../../../domain/InvalidCredentialsError";
import { AccountAlreadyVerifiedError } from "../../../domain/AccountAlreadyVerifiedError";
import { AccountNotVerifiedError } from "../../../domain/AccountNotVerifiedError";
import { AccountNotFoundError } from "../../../domain/AccountNotFoundError";

export class AccountsInMemory implements Accounts {
  private _database = new Map<
    string,
    VerifiedAccount | UnverifiedAccount | AccountForgotPassword
  >();

  async verifiedAccountOfEmail(email: string): Promise<VerifiedAccount> {
    const account = this.getAccount(email);

    if (account == null) throw new InvalidCredentialsError("Account not found");
    if (account.type !== "verified")
      throw new AccountNotVerifiedError(account.email);

    return account;
  }

  async unverifiedAccountOfEmail(email: string): Promise<UnverifiedAccount> {
    const account = this.getAccount(email);

    if (account == null) throw new AccountNotFoundError(email);
    if (account.type !== "unverified")
      throw new AccountAlreadyVerifiedError(account.email);

    return account;
  }

  async accountForgotPasswordOfEmail(
    email: string
  ): Promise<AccountForgotPassword> {
    const account = this.getAccount(email);

    if (account == null) throw new AccountNotFoundError(email);
    if (account.type !== "forgot-password")
      throw new Error("Error in test setup");

    return account;
  }

  private getAccount(email: string) {
    return this._database.get(email.toLowerCase());
  }

  async save(
    account: VerifiedAccount | UnverifiedAccount | AccountForgotPassword
  ): Promise<void> {
    this._database.set(account.email.toLowerCase(), account);
  }
}
