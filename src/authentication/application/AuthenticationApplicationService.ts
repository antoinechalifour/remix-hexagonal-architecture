import { Injectable } from "@nestjs/common";
import { v4 as uuid } from "uuid";
import { GenerateUUID } from "shared/id";
import { NestEvents } from "shared/events";
import { RealClock } from "shared/time";
import { LoginFlow } from "../usecase/LoginFlow";
import { RegisterFlow } from "../usecase/RegisterFlow";
import { VerifyAccount } from "../usecase/VerifyAccount";
import { ForgotPassword } from "../usecase/ForgotPassword";
import { ResetPassword } from "../usecase/ResetPassword";
import { EmailAlreadyInUseError } from "../domain/EmailAlreadyInUseError";
import { InvalidCredentialsError } from "../domain/InvalidCredentialsError";
import { AccountNotVerifiedError } from "../domain/AccountNotVerifiedError";
import { AccountNotFoundError } from "../domain/AccountNotFoundError";
import { BCryptPasswordHasher } from "../infrastructure/BCryptPasswordHasher";
import { AccountDatabaseRepository } from "../infrastructure/AccountDatabaseRepository";
import { FetchAuthenticationStatusSessionQuery } from "../infrastructure/FetchAuthenticationStatusSessionQuery";

type LoginResult =
  | [{ message: string }, null]
  | [null, { userId: string; id: string }];

@Injectable()
export class AuthenticationApplicationService {
  constructor(
    private readonly fetchAuthenticationStatus: FetchAuthenticationStatusSessionQuery,
    private readonly accounts: AccountDatabaseRepository,
    private readonly generateId: GenerateUUID,
    private readonly clock: RealClock,
    private readonly passwordHasher: BCryptPasswordHasher,
    private readonly events: NestEvents
  ) {}

  async login(email: string, password: string): Promise<LoginResult> {
    try {
      const userId = await new LoginFlow(
        this.accounts,
        this.passwordHasher
      ).execute(email, password);

      return [null, { id: uuid(), userId }];
    } catch (err) {
      let message: string;

      if (AccountNotVerifiedError.is(err)) message = err.message;
      else if (InvalidCredentialsError.is(err))
        message = "Could not login. Make sure your credentials are valid.";
      else throw err;

      return [{ message }, null];
    }
  }

  async register(email: string, password: string) {
    try {
      await new RegisterFlow(
        this.accounts,
        this.generateId,
        this.passwordHasher,
        this.clock,
        this.events
      ).execute(email, password);
    } catch (err) {
      let message: string;

      if (EmailAlreadyInUseError.is(err)) message = err.message;
      else throw err;

      return { message };
    }
  }

  async verifyAccount(email: string, token: string) {
    const userId = await new VerifyAccount(this.accounts).execute(email, token);

    return { userId, id: uuid() };
  }

  async forgotPassword(email: string) {
    try {
      await new ForgotPassword(
        this.accounts,
        this.generateId,
        this.clock,
        this.events
      ).execute(email);
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
      this.clock,
      this.events
    ).execute(email, token, newPassword);
  }

  authenticationStatus() {
    return this.fetchAuthenticationStatus.run();
  }
}
