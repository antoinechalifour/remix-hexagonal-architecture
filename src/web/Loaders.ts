import { Injectable } from "@nestjs/common";
import { json, redirect } from "remix";
import { DataFunctionArgs } from "@remix-run/node";
import {
  FetchHomePagePrismaQuery,
  FetchTodoListPrismaQuery,
} from "todo-list-manager";
import { requireAuthentication, sessionFromCookies } from "./http";
import { commitSession, isAuthenticatedSession } from "./sessions";

@Injectable()
export class Loaders {
  constructor(
    private readonly fetchHomePageQuery: FetchHomePagePrismaQuery,
    private readonly fetchTodoListQuery: FetchTodoListPrismaQuery
  ) {}

  async login({ request }: DataFunctionArgs) {
    const session = await sessionFromCookies(request);

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

  async homePage({ request }: DataFunctionArgs) {
    await requireAuthentication(request);
    return this.fetchHomePageQuery.run();
  }

  async todoList({ request, params }: DataFunctionArgs) {
    await requireAuthentication(request);
    return this.fetchTodoListQuery.run(params.todoListId as string);
  }
}
