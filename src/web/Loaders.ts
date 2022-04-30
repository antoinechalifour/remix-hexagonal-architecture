import { Injectable } from "@nestjs/common";
import { json, redirect, Session } from "remix";
import {
  FetchHomePagePrismaQuery,
  FetchTodoListPrismaQuery,
} from "todo-list-manager";
import { DataFunction, Params, SessionManager } from "remix-nest-adapter";
import { isAuthenticatedSession } from "./sessions";
import { FetchTodoListParams } from "./dtos/FetchTodoList";
import { Authenticated } from "./decorators/Authenticated";
import { Authenticator } from "./Authenticator";

@Injectable()
export class Loaders {
  constructor(
    private readonly sessionManager: SessionManager,
    private readonly authenticator: Authenticator,
    private readonly fetchHomePageQuery: FetchHomePagePrismaQuery,
    private readonly fetchTodoListQuery: FetchTodoListPrismaQuery
  ) {}

  @DataFunction()
  async login() {
    const isAuthenticated = await this.authenticator.isAuthenticated();
    if (isAuthenticated) return redirect("/");

    const session = await this.sessionManager.get();
    const error = session.get("error");

    return json(
      { error },
      {
        headers: {
          "Set-Cookie": await this.sessionManager.commit(session),
        },
      }
    );
  }

  @Authenticated()
  @DataFunction()
  async homePage() {
    return this.fetchHomePageQuery.run();
  }

  @Authenticated()
  @DataFunction()
  async todoList(@Params() params: FetchTodoListParams) {
    return this.fetchTodoListQuery.run(params.todoListId);
  }
}
