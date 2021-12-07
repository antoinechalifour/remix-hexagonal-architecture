import type { ActionFunction } from "remix";
import { container } from "~/container";
import { ArchiveTodoAction } from "~/application/actions/ArchiveTodoAction";

export const action: ActionFunction = async (context) =>
  container.build(ArchiveTodoAction).run(context);

export default function Noop() {
  return null;
}
