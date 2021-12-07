import type { DataFunctionArgs } from "@remix-run/server-runtime";
import type { TodoId } from "~/domain/Todo";

import { redirect } from "remix";
import { ArchiveTodo } from "~/domain/ArchiveTodo";

interface ArchiveTodoActionOptions {
  archiveTodo: ArchiveTodo;
}

export class ArchiveTodoAction {
  private readonly archiveTodo;

  constructor({ archiveTodo }: ArchiveTodoActionOptions) {
    this.archiveTodo = archiveTodo;
  }

  async run({ params }: DataFunctionArgs) {
    await this.archiveTodo.execute(params.todoId as TodoId);

    return redirect(`/l/${params.todoListId}`);
  }
}
