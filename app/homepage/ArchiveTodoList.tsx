import type { TodoListSummaryWithPermissionDto } from "shared/client";
import type { useFetcher } from "@remix-run/react";
import React from "react";
import { TrashIcon } from "@radix-ui/react-icons";
import { Button } from "front/ui/Button";

export type ArchivetodoListProps = {
  todoList: TodoListSummaryWithPermissionDto;
  fetcher: ReturnType<typeof useFetcher>;
};

export const ArchiveTodoList = ({
  todoList,
  fetcher: archiveTodoListFetcher,
}: ArchivetodoListProps) => (
  <archiveTodoListFetcher.Form
    method="post"
    action={`/l/${todoList.id}/archive`}
    replace
    className="flex items-center"
  >
    <Button
      type="submit"
      disabled={archiveTodoListFetcher.state != "idle"}
      title="Archive this list"
    >
      <TrashIcon className="text-danger-lighter" width={20} height={20} />
    </Button>
  </archiveTodoListFetcher.Form>
);
