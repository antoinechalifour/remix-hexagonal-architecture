import type { ActionFunction } from "remix";
import type { TodoId } from "~/domain/Todo";

import { redirect } from "remix";
import { container } from "~/container";
import { ChangeTodoCompletion } from "~/domain/ChangeTodoCompletion";

export const action: ActionFunction = async ({ request, params }) => {
  const payload = await request.formData();

  await container
    .build(ChangeTodoCompletion)
    .execute(params.todoId as TodoId, payload.get("isChecked") as string);

  return redirect(`/l/${params.todoListId}`);
};

export default function Noop() {
  return null;
}
