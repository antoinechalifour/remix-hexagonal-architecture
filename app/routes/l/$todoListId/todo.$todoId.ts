import type { ActionFunction } from "remix";
import type { RemixAppContext } from "shared";

export const action: ActionFunction = async (args) =>
  (args.context as RemixAppContext).actions.changeTodoCompletion.run(args);

export default function Noop() {
  return null;
}
