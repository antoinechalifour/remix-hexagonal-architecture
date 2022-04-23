import type { DataFunctionArgs } from "@remix-run/node";

import { redirect } from "remix";
import { TodoApplicationService } from "todo-list-manager";
import { Injectable } from "@nestjs/common";
import { requireAuthentication } from "../http";

@Injectable()
export class ArchiveTodoAction {
  constructor(
    private readonly todoApplicationService: TodoApplicationService
  ) {}

  async run({ request, params }: DataFunctionArgs) {
    await requireAuthentication(request);
    await this.todoApplicationService.archive(params.todoId as string);

    return redirect(`/l/${params.todoListId}`);
  }
}
