import { Accounts } from "../domain/Accounts";
import { PasswordHasher } from "../domain/PasswordHasher";

export type LoginResult = [Error, null] | [null, string];

export class LoginFlow {
  constructor(
    private readonly accounts: Accounts,
    private readonly passwordHasher: PasswordHasher
  ) {}

  async execute(email: string, password: string): Promise<LoginResult> {
    let isValidCredentials = false;
    const error = new Error(
      "Could not log you in. Make sure your credentials are valid."
    );

    try {
      const account = await this.accounts.ofEmail(email);

      isValidCredentials = await this.passwordHasher.verify(
        password,
        account.hash
      );

      if (!isValidCredentials) return [error, null];

      return [null, account.id];
    } catch {
      return [error, null];
    }
  }
}
