import type { ActionFunction } from "remix";

import { container } from "~/container";
import { ArchiveTodoListAction } from "~/application/actions/ArchiveTodoListAction";

export const action: ActionFunction = async (context) =>
  container.build(ArchiveTodoListAction).run(context);

export default function Noop() {
  return null;
}
