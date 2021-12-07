import type { ActionFunction } from "remix";

import { container } from "~/container";
import { ChangeTodoCompletionAction } from "~/application/actions/ChangeTodoCompletionAction";

export const action: ActionFunction = async (context) =>
  container.build(ChangeTodoCompletionAction).run(context);

export default function Noop() {
  return null;
}
