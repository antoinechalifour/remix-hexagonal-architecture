import { Inject, Injectable } from "@nestjs/common";
import { Prisma } from "shared";
import { PRISMA } from "../../keys";
import { Accounts } from "../domain/Accounts";
import { Account } from "../domain/Account";

@Injectable()
export class AccountDatabaseRepository implements Accounts {
  constructor(
    @Inject(PRISMA)
    private readonly prisma: Prisma
  ) {}

  async ofEmail(email: string): Promise<Account> {
    const account = await this.prisma.account.findFirst({
      where: { email },
      rejectOnNotFound: true,
    });

    return {
      id: account.id,
      email: account.email,
      hash: account.hash,
    };
  }

  async save(account: Account): Promise<void> {
    await this.prisma.account.create({
      data: {
        id: account.id,
        email: account.email,
        hash: account.hash,
      },
    });
  }
}
