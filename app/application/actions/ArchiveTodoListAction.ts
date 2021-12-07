import type { DataFunctionArgs } from "@remix-run/server-runtime";
import type { TodoListId } from "~/domain/TodoList";

import { redirect } from "remix";
import { ArchiveTodoList } from "~/domain/ArchiveTodoList";

interface ArchiveTodoListActionOptions {
  archiveTodoList: ArchiveTodoList;
}

export class ArchiveTodoListAction {
  private readonly archiveTodoList;

  constructor({ archiveTodoList }: ArchiveTodoListActionOptions) {
    this.archiveTodoList = archiveTodoList;
  }

  async run({ params }: DataFunctionArgs) {
    await this.archiveTodoList.execute(params.todoListId as TodoListId);

    return redirect("/");
  }
}
