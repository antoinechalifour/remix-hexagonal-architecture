import { Injectable } from "@nestjs/common";
import { json, redirect, Session } from "remix";
import {
  FetchHomePagePrismaQuery,
  FetchTodoListPrismaQuery,
} from "todo-list-manager";
import { commitSession, isAuthenticatedSession } from "./sessions";
import {
  Authenticated,
  CurrentSession,
  DataFunction,
  Params,
} from "./decorators";
import { FetchTodoListParams } from "./dtos/FetchTodoList";

@Injectable()
export class Loaders {
  constructor(
    private readonly fetchHomePageQuery: FetchHomePagePrismaQuery,
    private readonly fetchTodoListQuery: FetchTodoListPrismaQuery
  ) {}

  @DataFunction()
  async login(@CurrentSession() session: Session) {
    if (isAuthenticatedSession(session)) return redirect("/");

    const error = session.get("error");

    return json(
      { error },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
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
