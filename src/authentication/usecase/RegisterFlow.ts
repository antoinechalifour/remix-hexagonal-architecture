import type { GenerateId } from "shared/id";
import type { Events } from "shared/events";
import type { Accounts } from "../domain/Accounts";
import type { PasswordHasher } from "../domain/PasswordHasher";
import { register } from "../domain/Account";
import { UserRegistered } from "../domain/UserRegistered";

export class RegisterFlow {
  constructor(
    private readonly credentials: Accounts,
    private readonly generateId: GenerateId,
    private readonly passwordHasher: PasswordHasher,
    private readonly events: Events
  ) {}

  async execute(username: string, password: string) {
    const account = await register(
      username,
      password,
      this.generateId,
      this.passwordHasher
    );

    await this.credentials.save(account);
    this.events.publish(
      new UserRegistered(account.email, account.verificationToken)
    );
  }
}
