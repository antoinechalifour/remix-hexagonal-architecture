import type { ActionFunction } from "remix";

import { container } from "~/container";
import { requireAuthentication } from "~/application/remix/http";
import { ArchiveTodoListAction } from "~/application/actions/ArchiveTodoListAction";

export const action: ActionFunction = async (context) => {
  await requireAuthentication(context.request);
  return container.build(ArchiveTodoListAction).run(context);
};

export default function Noop() {
  return null;
}
