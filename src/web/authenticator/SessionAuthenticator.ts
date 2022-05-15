import { Injectable } from "@nestjs/common";
import { SessionManager } from "remix-nest-adapter";
import { CurrentUser, Authenticator } from "authentication";

@Injectable()
export class SessionAuthenticator implements Authenticator {
  constructor(private readonly sessionManager: SessionManager) {}

  async isAuthenticated() {
    const session = await this.sessionManager.get();
    return session.has("userId") && session.has("sessionId");
  }

  async currentUser(): Promise<CurrentUser> {
    const session = await this.sessionManager.get();
    return {
      id: session.get("userId"),
      sessionId: session.get("sessionId"),
    };
  }
}
