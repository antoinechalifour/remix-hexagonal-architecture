import { Injectable } from "@nestjs/common";
import { PrismaRepository } from "shared/database";
import { Accounts } from "../domain/Accounts";
import {
  AccountForgotPassword,
  UnverifiedAccount,
  VerifiedAccount,
} from "../domain/Account";
import { EmailAlreadyInUseError } from "../domain/EmailAlreadyInUseError";
import { InvalidCredentialsError } from "../domain/InvalidCredentialsError";
import { AccountAlreadyVerifiedError } from "../domain/AccountAlreadyVerifiedError";
import { AccountNotVerifiedError } from "../domain/AccountNotVerifiedError";
import { AccountNotFoundError } from "../domain/AccountNotFoundError";
import assert from "assert";

@Injectable()
export class AccountDatabaseRepository
  extends PrismaRepository
  implements Accounts
{
  async verifiedAccountOfEmail(email: string): Promise<VerifiedAccount> {
    const account = await this.prisma.account.findFirst({
      where: { email },
    });

    if (account == null) throw new InvalidCredentialsError();
    if (!account.verified) throw new AccountNotVerifiedError(account.email);

    return {
      type: "verified",
      id: account.id,
      email: account.email,
      hash: account.hash,
    };
  }

  async unverifiedAccountOfEmail(email: string): Promise<UnverifiedAccount> {
    const account = await this.prisma.account.findFirst({
      where: { email },
    });

    if (account == null) throw new AccountNotFoundError(email);
    if (account.verified) throw new AccountAlreadyVerifiedError(account.email);
    assert(
      account.verificationToken,
      `Missing verification token for unverified account ${email}`
    );

    return {
      type: "unverified",
      id: account.id,
      email: account.email,
      verificationToken: account.verificationToken,
      hash: account.hash,
    };
  }

  async accountForgotPasswordOfEmail(
    email: string
  ): Promise<AccountForgotPassword> {
    const account = await this.prisma.account.findFirst({
      where: { email },
    });

    if (account == null) throw new AccountNotFoundError(email);

    assert(
      account.passwordResetToken,
      `Missing password reset token for account ${email}`
    );
    assert(
      account.passwordResetExpiration,
      `Missing password reset expiration for account ${email}`
    );

    return {
      type: "forgot-password",
      id: account.id,
      email: account.email,
      passwordResetToken: account.passwordResetToken,
      passwordResetExpiration: account.passwordResetExpiration,
    };
  }

  async save(
    account: VerifiedAccount | UnverifiedAccount | AccountForgotPassword
  ): Promise<void> {
    try {
      switch (account.type) {
        case "verified":
          await this.saveVerifiedAccount(account);
          break;
        case "unverified":
          await this.saveUnverifiedAccount(account);
          break;
        case "forgot-password":
          await this.saveAccountForgotPassword(account);
          break;
      }
    } catch (e) {
      if (this.isUniqueConstraintFailed(e))
        throw new EmailAlreadyInUseError(account.email);
      throw e;
    }
  }

  private saveVerifiedAccount(account: VerifiedAccount) {
    return this.prisma.account.update({
      where: { id: account.id },
      data: {
        verified: true,
        hash: account.hash,
        verificationToken: null,
        passwordResetExpiration: null,
        passwordResetToken: null,
      },
    });
  }

  private saveUnverifiedAccount(account: UnverifiedAccount) {
    return this.prisma.account.create({
      data: {
        id: account.id,
        email: account.email,
        hash: account.hash,
        verified: false,
        verificationToken: account.verificationToken,
      },
    });
  }

  private saveAccountForgotPassword(account: AccountForgotPassword) {
    return this.prisma.account.update({
      where: { id: account.id },
      data: {
        passwordResetToken: account.passwordResetToken,
        passwordResetExpiration: account.passwordResetExpiration,
      },
    });
  }
}
