import type { ActionFunction } from "@remix-run/node";
import type { RemixAppContext } from "web";

export const action: ActionFunction = async (args) =>
  (args.context as RemixAppContext).actions.changeTodoCompletion(args);

export default function Noop() {
  return null;
}
