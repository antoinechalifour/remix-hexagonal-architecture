import { ActionFunction } from "remix";
import { RemixAppContext } from "web";

export const action: ActionFunction = (args) =>
  (args.context as RemixAppContext).actions.reorderTodoList(args);
