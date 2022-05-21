import { Injectable } from "@nestjs/common";
import { PrismaRepository } from "../../shared/PrismaRepository";
import { Accounts } from "../domain/Accounts";
import { VerifiedAccount, UnverifiedAccount } from "../domain/Account";
import { EmailAlreadyInUseError } from "../domain/EmailAlreadyInUseError";
import { InvalidCredentialsError } from "../domain/InvalidCredentialsError";

@Injectable()
export class AccountDatabaseRepository
  extends PrismaRepository
  implements Accounts
{
  async verifiedAccountOfEmail(email: string): Promise<VerifiedAccount> {
    const account = await this.prisma.account.findFirst({
      where: { email, verified: true },
    });

    if (account == null) throw new InvalidCredentialsError();

    return {
      id: account.id,
      email: account.email,
      hash: account.hash,
      verified: true,
    };
  }

  async unverifiedAccountOfEmail(email: string): Promise<UnverifiedAccount> {
    const account = await this.prisma.account.findFirst({
      where: { email, verified: false },
    });

    if (account == null) throw new Error(`Account ${email} not found`);
    const unverifiedAccount = account as UnverifiedAccount;

    return {
      id: unverifiedAccount.id,
      email: unverifiedAccount.email,
      verified: false,
      verificationToken: unverifiedAccount.verificationToken,
      hash: unverifiedAccount.hash,
    };
  }

  async save(account: VerifiedAccount | UnverifiedAccount): Promise<void> {
    try {
      await this.prisma.account.upsert({
        create: {
          id: account.id,
          email: account.email,
          hash: account.hash,
          verified: account.verified,
          verificationToken:
            "verificationToken" in account ? account.verificationToken : null,
        },
        update: {
          verified: account.verified,
          verificationToken:
            "verificationToken" in account ? account.verificationToken : null,
        },
        where: {
          email: account.email,
        },
      });
    } catch (e) {
      if (this.isUniqueConstraintFailed(e))
        throw new EmailAlreadyInUseError(account.email);
      throw e;
    }
  }
}
