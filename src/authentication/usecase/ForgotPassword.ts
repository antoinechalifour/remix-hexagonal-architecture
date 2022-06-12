import type { GenerateId } from "shared/id";
import type { Events } from "shared/events";
import type { Clock } from "shared/time";
import type { Accounts } from "../domain/Accounts";
import { generateResetPasswordToken } from "../domain/Account";
import { PasswordForgotten } from "../domain/event/PasswordForgotten";

export class ForgotPassword {
  constructor(
    private readonly accounts: Accounts,
    private readonly generateId: GenerateId,
    private readonly clock: Clock,
    private readonly events: Events
  ) {}

  async execute(email: string) {
    const account = generateResetPasswordToken(
      await this.accounts.verifiedAccountOfEmail(email),
      this.generateId,
      this.clock
    );
    await this.accounts.save(account);
    this.events.publish(
      new PasswordForgotten(
        account.email,
        account.passwordResetToken,
        this.clock.now()
      )
    );
  }
}
