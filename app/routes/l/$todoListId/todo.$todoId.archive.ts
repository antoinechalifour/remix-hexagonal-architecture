import type { ActionFunction } from "remix";
import type { TodoId } from "~/domain/Todo";

import { redirect } from "remix";
import { container } from "~/container";
import { ArchiveTodo } from "~/domain/ArchiveTodo";

export const action: ActionFunction = async ({ params }) => {
  await container.build(ArchiveTodo).execute(params.todoId as TodoId);

  return redirect(`/l/${params.todoListId}`);
};

export default function Noop() {
  return null;
}
