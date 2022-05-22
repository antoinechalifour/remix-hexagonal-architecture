import { Injectable } from "@nestjs/common";
import { json } from "remix";
import { v4 as uuid } from "uuid";
import { SessionManager } from "remix-nest-adapter";
import { GenerateUUID } from "shared/id";
import { NestEvents } from "shared/events";
import { RealClock } from "shared/time";
import { LoginFlow } from "../usecase/LoginFlow";
import { RegisterFlow } from "../usecase/RegisterFlow";
import { VerifyAccount } from "../usecase/VerifyAccount";
import { EmailAlreadyInUseError } from "../domain/EmailAlreadyInUseError";
import { InvalidCredentialsError } from "../domain/InvalidCredentialsError";
import { InvalidVerificationTokenError } from "../domain/InvalidVerificationTokenError";
import { AccountAlreadyVerifiedError } from "../domain/AccountAlreadyVerifiedError";
import { AccountNotVerifiedError } from "../domain/AccountNotVerifiedError";
import { AccountNotFoundError } from "../domain/AccountNotFoundError";
import { UserRegistered } from "../domain/UserRegistered";
import { BCryptPasswordHasher } from "../infrastructure/BCryptPasswordHasher";
import { AccountDatabaseRepository } from "../infrastructure/AccountDatabaseRepository";
import { PasswordForgotten } from "../domain/PasswordForgotten";
import { GenerateResetPasswordToken } from "../usecase/GenerateResetPasswordToken";
import { ResetPassword } from "../usecase/ResetPassword";

@Injectable()
export class AuthenticationApplicationService {
  constructor(
    private readonly sessionManager: SessionManager,
    private readonly accounts: AccountDatabaseRepository,
    private readonly generateId: GenerateUUID,
    private readonly clock: RealClock,
    private readonly passwordHasher: BCryptPasswordHasher,
    private readonly events: NestEvents
  ) {}

  async login(email: string, password: string) {
    const session = await this.sessionManager.get();
    let url = "/";

    try {
      const userId = await new LoginFlow(
        this.accounts,
        this.passwordHasher
      ).execute(email, password);

      session.set("userId", userId);
      session.set("sessionId", uuid());
    } catch (err) {
      let message: string;

      if (AccountNotVerifiedError.is(err)) message = err.message;
      else if (InvalidCredentialsError.is(err))
        message = "Could not login. Make sure your credentials are valid.";
      else throw err;

      session.flash("error", message);
      url = "/login";
    }

    return {
      url,
      cookie: await this.sessionManager.commit(session),
    };
  }

  async register(email: string, password: string) {
    const session = await this.sessionManager.get();
    let url = "/welcome";

    try {
      const account = await new RegisterFlow(
        this.accounts,
        this.generateId,
        this.passwordHasher
      ).execute(email, password);

      this.events.publish(
        new UserRegistered(account.email, account.verificationToken)
      );
    } catch (err) {
      let message: string;

      if (EmailAlreadyInUseError.is(err)) message = err.message;
      else throw err;

      session.flash("error", message);
      url = "/login";
    }

    return {
      url,
      cookie: await this.sessionManager.commit(session),
    };
  }

  async verifyAccount(email: string, token: string) {
    const session = await this.sessionManager.get();
    try {
      const userId = await new VerifyAccount(this.accounts).execute(
        email,
        token
      );
      session.set("userId", userId);
      session.set("sessionId", uuid());

      return { cookie: await this.sessionManager.commit(session) };
    } catch (err) {
      let message: string;
      if (InvalidVerificationTokenError.is(err)) message = "token is not valid";
      else if (AccountNotFoundError.is(err)) message = "account was not found";
      else if (AccountAlreadyVerifiedError.is(err))
        message = "account is already verified";
      else throw err;

      throw json({ message }, { status: 400 });
    }
  }

  async forgotPassword(email: string) {
    try {
      const account = await new GenerateResetPasswordToken(
        this.accounts,
        this.generateId,
        this.clock
      ).execute(email);

      this.events.publish(
        new PasswordForgotten(account.email, account.passwordResetToken)
      );
    } catch (err) {
      if (AccountNotFoundError.is(err)) return;
      if (AccountNotVerifiedError.is(err)) return;

      throw err;
    }
  }

  async resetPassword(email: string, token: string, newPassword: string) {
    await new ResetPassword(
      this.accounts,
      this.passwordHasher,
      this.clock
    ).execute(email, token, newPassword);
  }
}
