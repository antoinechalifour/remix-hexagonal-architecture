import { GenerateId } from "shared/id";
import { Accounts } from "../domain/Accounts";
import { generateResetPasswordToken } from "../domain/Account";
import { Clock } from "shared/time";

export class GenerateResetPasswordToken {
  constructor(
    private readonly accounts: Accounts,
    private readonly generateId: GenerateId,
    private readonly clock: Clock
  ) {}

  async execute(email: string) {
    const account = generateResetPasswordToken(
      await this.accounts.verifiedAccountOfEmail(email),
      this.generateId,
      this.clock
    );
    await this.accounts.save(account);
    return account;
  }
}
