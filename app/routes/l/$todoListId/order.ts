import type { ActionFunction } from "remix";
import type { RemixAppContext } from "web";

export const action: ActionFunction = (args) =>
  (args.context as RemixAppContext).actions.reorderTodoList(args);
