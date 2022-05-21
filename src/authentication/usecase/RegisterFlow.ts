import type { GenerateId } from "shared/id";
import type { Accounts } from "../domain/Accounts";
import type { PasswordHasher } from "../domain/PasswordHasher";

import { register } from "../domain/Account";

export class RegisterFlow {
  constructor(
    private readonly credentials: Accounts,
    private readonly generateId: GenerateId,
    private readonly passwordHasher: PasswordHasher
  ) {}

  async execute(username: string, password: string) {
    const account = await register(
      username,
      password,
      this.generateId,
      this.passwordHasher
    );

    await this.credentials.save(account);

    return account;
  }
}
