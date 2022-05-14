import { Injectable } from "@nestjs/common";
import { Session } from "remix";
import { LoginFlow } from "../usecase/LoginFlow";
import { RegisterFlow } from "../usecase/RegisterFlow";
import { GenerateUUID } from "shared";
import { BCryptPasswordHasher } from "../infrastructure/BCryptPasswordHasher";
import { AccountDatabaseRepository } from "../infrastructure/AccountDatabaseRepository";

@Injectable()
export class LoginApplicationService {
  constructor(
    private readonly accounts: AccountDatabaseRepository,
    private readonly generateId: GenerateUUID,
    private readonly passwordHasher: BCryptPasswordHasher
  ) {}

  async login(session: Session, email: string, password: string) {
    const [error, userId] = await new LoginFlow(
      this.accounts,
      this.passwordHasher
    ).execute(email, password);

    let url;

    if (error) {
      session.flash("error", error.message);
      url = "/login";
    } else {
      session.set("userId", userId);
      url = "/";
    }

    return url;
  }

  async register(email: string, password: string) {
    await new RegisterFlow(
      this.accounts,
      this.generateId,
      this.passwordHasher
    ).execute(email, password);
  }
}
