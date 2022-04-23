import type { DataFunctionArgs } from "@remix-run/node";

import { redirect } from "remix";
import { TodoListApplicationService } from "todo-list-manager";
import { Injectable } from "@nestjs/common";
import { requireAuthentication } from "../http";

@Injectable()
export class ArchiveTodoListAction {
  constructor(
    private readonly todoListApplicationService: TodoListApplicationService
  ) {}

  async run({ request, params }: DataFunctionArgs) {
    await requireAuthentication(request);
    await this.todoListApplicationService.archive(params.todoListId as string);

    return redirect("/");
  }
}
