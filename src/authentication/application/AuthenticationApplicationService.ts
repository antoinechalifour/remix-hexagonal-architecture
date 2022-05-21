import { Injectable } from "@nestjs/common";
import { json } from "remix";
import { v4 as uuid } from "uuid";
import { SessionManager } from "remix-nest-adapter";
import { GenerateUUID } from "shared";
import { NestEvents } from "../../shared/NestEvents";
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

export type LoginDto = {
  email: string;
  password: string;
  registration: boolean;
};

@Injectable()
export class AuthenticationApplicationService {
  constructor(
    private readonly sessionManager: SessionManager,
    private readonly accounts: AccountDatabaseRepository,
    private readonly generateId: GenerateUUID,
    private readonly passwordHasher: BCryptPasswordHasher,
    private readonly events: NestEvents
  ) {}

  async login(loginDto: LoginDto) {
    const session = await this.sessionManager.get();
    let url = "/";

    try {
      await this.handleRegistration(loginDto);
      const userId = await this.handleLogin(loginDto);
      session.set("userId", userId);
      session.set("sessionId", uuid());
    } catch (err: any) {
      let message: string;

      if (EmailAlreadyInUseError.is(err)) message = err.message;
      else if (AccountNotVerifiedError.is(err)) message = err.message;
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

  private async handleRegistration({
    email,
    password,
    registration,
  }: LoginDto) {
    if (!registration) return;

    const account = await new RegisterFlow(
      this.accounts,
      this.generateId,
      this.passwordHasher
    ).execute(email, password);

    this.events.publish(
      new UserRegistered(account.email, account.verificationToken)
    );
  }

  private handleLogin({ email, password }: LoginDto) {
    return new LoginFlow(this.accounts, this.passwordHasher).execute(
      email,
      password
    );
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
}
