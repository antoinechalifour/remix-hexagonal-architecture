import { Injectable } from "@nestjs/common";
import { SessionManager } from "remix-nest-adapter";

@Injectable()
export class Authenticator {
  constructor(private readonly sessionManager: SessionManager) {}

  async isAuthenticated() {
    const session = await this.sessionManager.get();
    return session.has("userId");
  }

  async currentUser(): Promise<string> {
    const session = await this.sessionManager.get();
    return session.get("userId");
  }
}
