import { Injectable } from "@nestjs/common";
import { LoginFlow } from "../usecase/LoginFlow";
import { CredentialsEnvironmentRepository } from "../persistence/CredentialsEnvironmentRepository";

@Injectable()
export class LoginApplicationService {
  constructor(private readonly credentials: CredentialsEnvironmentRepository) {}

  login(username: string, password: string) {
    return new LoginFlow(this.credentials).execute(username, password);
  }
}
