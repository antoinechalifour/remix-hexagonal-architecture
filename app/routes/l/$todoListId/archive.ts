import type { ActionFunction } from "remix";

import { RemixAppContext } from "shared";

export const action: ActionFunction = async (args) =>
  (args.context as RemixAppContext).actions.archiveTodoList.run(args);

export default function Noop() {
  return null;
}
