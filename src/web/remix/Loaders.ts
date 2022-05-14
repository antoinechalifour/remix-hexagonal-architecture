import { Inject, Injectable } from "@nestjs/common";
import { json, redirect } from "remix";
import { DataFunction, Params, SessionManager } from "remix-nest-adapter";
import {
  Authenticator,
  FetchAuthenticationStatusDatabaseQuery,
} from "authentication";
import {
  FetchHomePageDatabaseQuery,
  FetchTodoListDatabaseQuery,
} from "todo-list-manager";
import { AUTHENTICATOR } from "../../keys";
import { FetchTodoListParams } from "../dtos/FetchTodoList";
import { Authenticated } from "../decorators/Authenticated";

@Injectable()
export class Loaders {
  constructor(
    @Inject(AUTHENTICATOR)
    private readonly authenticator: Authenticator,
    private readonly sessionManager: SessionManager,
    private readonly fetchHomePageQuery: FetchHomePageDatabaseQuery,
    private readonly fetchTodoListQuery: FetchTodoListDatabaseQuery,
    private readonly fetchAuthenticationStatus: FetchAuthenticationStatusDatabaseQuery
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

  @DataFunction()
  async root() {
    return this.fetchAuthenticationStatus.run();
  }

  @Authenticated()
  @DataFunction()
  async logout() {
    return redirect("/login", {
      headers: {
        "Set-Cookie": await this.sessionManager.destroy(),
      },
    });
  }

  @Authenticated()
  @DataFunction()
  async homePage() {
    return this.fetchHomePageQuery.run(await this.authenticator.currentUser());
  }

  @Authenticated()
  @DataFunction()
  async todoList(@Params() params: FetchTodoListParams) {
    return this.fetchTodoListQuery.run(
      params.todoListId,
      await this.authenticator.currentUser()
    );
  }
}
