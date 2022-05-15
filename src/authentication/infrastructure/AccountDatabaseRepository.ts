import { Injectable } from "@nestjs/common";
import { PrismaRepository } from "../../shared/PrismaRepository";
import { Accounts } from "../domain/Accounts";
import { Account } from "../domain/Account";
import { EmailAlreadyInUseError } from "../domain/EmailAlreadyInUseError";
import { InvalidCredentialsError } from "../domain/InvalidCredentialsError";

@Injectable()
export class AccountDatabaseRepository
  extends PrismaRepository
  implements Accounts
{
  async ofEmail(email: string): Promise<Account> {
    const account = await this.prisma.account.findFirst({
      where: { email },
    });

    if (account == null) throw new InvalidCredentialsError();

    return {
      id: account.id,
      email: account.email,
      hash: account.hash,
    };
  }

  async save(account: Account): Promise<void> {
    try {
      await this.prisma.account.create({
        data: {
          id: account.id,
          email: account.email,
          hash: account.hash,
        },
      });
    } catch (e) {
      if (this.isUniqueConstraintFailed(e))
        throw new EmailAlreadyInUseError(account.email);
      throw e;
    }
  }
}
