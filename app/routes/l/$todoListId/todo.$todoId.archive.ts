import type { ActionFunction } from "remix";
import { container } from "~/container";
import { requireAuthentication } from "~/application/remix/http";
import { ArchiveTodoAction } from "~/application/actions/ArchiveTodoAction";

export const action: ActionFunction = async (context) => {
  await requireAuthentication(context.request);
  return container.build(ArchiveTodoAction).run(context);
};

export default function Noop() {
  return null;
}
