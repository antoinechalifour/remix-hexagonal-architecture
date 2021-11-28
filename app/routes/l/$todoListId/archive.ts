import type { ActionFunction } from "remix";
import type { TodoListId } from "~/domain/TodoList";

import { redirect } from "remix";
import { container } from "~/container";
import { ArchiveTodoList } from "~/domain/ArchiveTodoList";

export const action: ActionFunction = async ({ params }) => {
  await container
    .build(ArchiveTodoList)
    .execute(params.todoListId as TodoListId);

  return redirect("/");
};

export default function Noop() {
  return null;
}
