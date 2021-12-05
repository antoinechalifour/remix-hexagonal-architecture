import type { ActionFunction } from "remix";

import { container } from "~/container";
import { requireAuthentication } from "~/application/remix/http";
import { ChangeTodoCompletionAction } from "~/application/actions/ChangeTodoCompletionAction";

export const action: ActionFunction = async (context) => {
  await requireAuthentication(context.request);
  return container.build(ChangeTodoCompletionAction).run(context);
};

export default function Noop() {
  return null;
}
