import { Accounts } from "../domain/Accounts";
import { verify } from "../domain/Account";

export class VerifyAccount {
  constructor(private readonly accounts: Accounts) {}

  async execute(email: string, token: string) {
    const account = await this.accounts.unverifiedAccountOfEmail(email);
    await this.accounts.save(verify(account, token));
  }
}
