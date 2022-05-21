import { Inject, Injectable } from "@nestjs/common";
import { json, redirect } from "remix";
import {
  DataFunction,
  Params,
  Query,
  SessionManager,
} from "remix-nest-adapter";
import {
  AuthenticationApplicationService,
  Authenticator,
  FetchAuthenticationStatusDatabaseQuery,
} from "authentication";
import {
  FetchHomePageDatabaseQuery,
  FetchTodoListDatabaseQuery,
} from "todo-list-manager";
import { AUTHENTICATOR } from "../../keys";
import { FetchTodoListParams } from "./dtos/FetchTodoList";
import { Authenticated } from "../authenticator/Authenticated";
import { VerifyAccountQuery } from "./dtos/VerifyAccount";

@Injectable()
export class Loaders {
  constructor(
    @Inject(AUTHENTICATOR)
    private readonly authenticator: Authenticator,
    private readonly sessionManager: SessionManager,
    private readonly authenticationApplicationService: AuthenticationApplicationService,
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

  @DataFunction()
  async verifyAccount(@Query() query: VerifyAccountQuery) {
    const isAuthenticated = await this.authenticator.isAuthenticated();
    if (isAuthenticated) return redirect("/");

    const { cookie } =
      await this.authenticationApplicationService.verifyAccount(
        query.email,
        query.token
      );

    return new Response(null, {
      headers: { "Set-Cookie": cookie },
    });
  }

  @Authenticated()
  @DataFunction()
  async homePage() {
    const currentUser = await this.authenticator.currentUser();
    return this.fetchHomePageQuery.run(currentUser.id);
  }

  @Authenticated()
  @DataFunction()
  async todoList(@Params() params: FetchTodoListParams) {
    const currentUser = await this.authenticator.currentUser();
    return this.fetchTodoListQuery.run(params.todoListId, currentUser.id);
  }
}
