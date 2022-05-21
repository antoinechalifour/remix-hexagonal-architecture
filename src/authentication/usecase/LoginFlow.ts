import { Accounts } from "../domain/Accounts";
import { PasswordHasher } from "../domain/PasswordHasher";
import { InvalidCredentialsError } from "../domain/InvalidCredentialsError";

export class LoginFlow {
  constructor(
    private readonly accounts: Accounts,
    private readonly passwordHasher: PasswordHasher
  ) {}

  async execute(email: string, password: string): Promise<string> {
    const account = await this.accounts.verifiedAccountOfEmail(email);
    const isValidCredentials = await this.passwordHasher.verify(
      password,
      account.hash
    );

    if (!isValidCredentials) throw new InvalidCredentialsError();
    return account.id;
  }
}
