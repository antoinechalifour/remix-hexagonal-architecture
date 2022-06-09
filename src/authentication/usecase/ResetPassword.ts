import type { Clock } from "shared/time";
import type { Events } from "shared/events";
import type { Accounts } from "../domain/Accounts";
import type { PasswordHasher } from "../domain/PasswordHasher";
import { resetPassword } from "../domain/Account";
import { PasswordChanged } from "../domain/PasswordChanged";

export class ResetPassword {
  constructor(
    private readonly accounts: Accounts,
    private readonly passwordHasher: PasswordHasher,
    private readonly clock: Clock,
    private readonly events: Events
  ) {}

  async execute(email: string, token: string, newPassword: string) {
    email = email.toLowerCase();
    const account = await this.accounts.accountForgotPasswordOfEmail(email);

    await this.accounts.save(
      await resetPassword(
        account,
        token,
        newPassword,
        this.passwordHasher,
        this.clock
      )
    );
    this.events.publish(new PasswordChanged(email, this.clock.now()));
  }
}
