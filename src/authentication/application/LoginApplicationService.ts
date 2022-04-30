import { Injectable } from "@nestjs/common";
import { LoginFlow } from "../usecase/LoginFlow";
import { CredentialsEnvironmentRepository } from "../persistence/CredentialsEnvironmentRepository";
import { Session } from "remix";

@Injectable()
export class LoginApplicationService {
  constructor(private readonly credentials: CredentialsEnvironmentRepository) {}

  async login(session: Session, username: string, password: string) {
    const [error, userId] = await new LoginFlow(this.credentials).execute(
      username,
      password
    );

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
}
