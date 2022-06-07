import type { ActionFunction } from "@remix-run/node";
import type { RemixAppContext } from "web";

export const action: ActionFunction = (args) =>
  (args.context as RemixAppContext).actions.removeTagFromTodo(args);
