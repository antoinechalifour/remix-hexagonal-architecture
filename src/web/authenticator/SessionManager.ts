import { Request } from "express";
import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import {
  createCookieSessionStorage,
  Session,
  SessionIdStorageStrategy,
} from "@remix-run/node";
import { SESSION_CONFIG } from "../../keys";

@Injectable({ scope: Scope.REQUEST })
export class SessionManager {
  private storage;

  constructor(
    @Inject(SESSION_CONFIG)
    private readonly options: SessionIdStorageStrategy["cookie"],
    @Inject(REQUEST)
    private readonly request: Request
  ) {
    this.storage = createCookieSessionStorage({ cookie: options });
  }

  get() {
    return this.storage.getSession(this.request.headers.cookie);
  }

  commit(session: Session) {
    return this.storage.commitSession(session);
  }

  async destroy() {
    const session = await this.storage.getSession(this.request.headers.cookie);
    return this.storage.destroySession(session);
  }
}
