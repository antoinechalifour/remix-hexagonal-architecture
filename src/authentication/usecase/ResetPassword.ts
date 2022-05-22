import { Clock } from "shared/time";
import { Accounts } from "../domain/Accounts";
import { PasswordHasher } from "../domain/PasswordHasher";
import { resetPassword } from "../domain/Account";

export class ResetPassword {
  constructor(
    private readonly accounts: Accounts,
    private readonly passwordHasher: PasswordHasher,
    private readonly clock: Clock
  ) {}

  async execute(email: string, token: string, newPassword: string) {
    const account = await this.accounts.accountForPasswordResettingOfEmail(
      email
    );

    await this.accounts.save(
      await resetPassword(
        account,
        token,
        newPassword,
        this.passwordHasher,
        this.clock
      )
    );
  }
}
