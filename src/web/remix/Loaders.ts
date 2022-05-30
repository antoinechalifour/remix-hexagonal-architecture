import { Inject, Injectable } from "@nestjs/common";
import { json, redirect } from "remix";
import {
  AuthenticationApplicationService,
  Authenticator,
} from "authentication";
import {
  TodoListApplicationService,
  TodoListNotFoundError,
  TodoListPermissionDeniedError,
} from "todo-list-manager";
import { AUTHENTICATOR } from "../../keys";
import { Authenticated } from "../authenticator/Authenticated";
import { SessionManager } from "../authenticator/SessionManager";
import { DataFunction } from "./decorators/DataFunction";
import { Query } from "./decorators/Query";
import { Params } from "./decorators/Params";
import { MapErrorThrowing } from "./decorators/MapErrorThrowing";
import { FetchTodoListParams } from "./dtos/FetchTodoList";
import { VerifyAccountQuery } from "./dtos/VerifyAccount";

@Injectable()
export class Loaders {
  constructor(
    @Inject(AUTHENTICATOR)
    private readonly authenticator: Authenticator,
    private readonly sessionManager: SessionManager,
    private readonly authenticationApplicationService: AuthenticationApplicationService,
    private readonly todoListApplicationService: TodoListApplicationService
  ) {}

  @DataFunction()
  async login() {
    const isAuthenticated = await this.authenticator.isAuthenticated();
    if (isAuthenticated) return redirect("/");

    const session = await this.sessionManager.get();

    return json(
      { error: session.get("error") },
      {
        headers: {
          "Set-Cookie": await this.sessionManager.commit(session),
        },
      }
    );
  }

  @DataFunction()
  async register() {
    const isAuthenticated = await this.authenticator.isAuthenticated();
    if (isAuthenticated) return redirect("/");

    const session = await this.sessionManager.get();

    return json(
      { error: session.get("error") },
      {
        headers: {
          "Set-Cookie": await this.sessionManager.commit(session),
        },
      }
    );
  }

  @DataFunction()
  async root() {
    return this.authenticationApplicationService.authenticationStatus();
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

    const session = await this.sessionManager.get();

    const [err, sessionData] =
      await this.authenticationApplicationService.verifyAccount(
        query.email,
        query.token
      );

    if (err) {
      throw json({ message: err.message }, { status: 400 });
    }

    session.set("userId", sessionData.userId);
    session.set("sessionId", sessionData.id);

    return new Response(null, {
      headers: { "Set-Cookie": await this.sessionManager.commit(session) },
    });
  }

  @Authenticated()
  @DataFunction()
  async homePage() {
    const currentUser = await this.authenticator.currentUser();
    return this.todoListApplicationService.viewHomePage(currentUser.id);
  }

  @Authenticated()
  @DataFunction()
  @MapErrorThrowing([
    [TodoListNotFoundError, 404],
    [TodoListPermissionDeniedError, 404],
  ])
  async todoList(@Params() params: FetchTodoListParams) {
    const currentUser = await this.authenticator.currentUser();

    return this.todoListApplicationService.viewTodoList(
      params.todoListId,
      currentUser.id
    );
  }
}
