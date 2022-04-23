import { Injectable } from "@nestjs/common";
import { FetchTodoListPrismaQuery } from "todo-list-manager";
import { requireAuthentication } from "../http";
import { DataFunctionArgs } from "@remix-run/node";

@Injectable()
export class TodoListPageLoader {
  constructor(private readonly fetchTodoListQuery: FetchTodoListPrismaQuery) {}

  async run({ request, params }: DataFunctionArgs) {
    await requireAuthentication(request);
    return this.fetchTodoListQuery.run(params.todoListId as string);
  }
}
