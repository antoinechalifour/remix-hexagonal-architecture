import type { TodoDto } from "shared/client";
import React, { useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { useOptimisticUpdates, useTodoListInfo } from "front/todolist/state";
import { Popover } from "front/ui/Popover";
import { PlainButton } from "front/ui/Button";

export type ArchiveTodoProps = { todo: TodoDto };

export const ArchiveTodo = ({ todo }: ArchiveTodoProps) => {
  const { id } = useTodoListInfo();
  const archiveTodoFetcher = useFetcher();
  const { archiveTodo } = useOptimisticUpdates();
  const isArchiving = archiveTodoFetcher.state === "submitting";

  useEffect(() => {
    const submission = archiveTodoFetcher.submission;
    if (submission == null) return;
    archiveTodo(todo.id);
  }, [archiveTodo, archiveTodoFetcher.submission, todo.id]);

  return (
    <Popover.Item>
      <archiveTodoFetcher.Form
        method="post"
        action={`/l/${id}/todo/${todo.id}/archive`}
        replace
        className="flex items-center"
      >
        <PlainButton
          type="submit"
          disabled={isArchiving}
          className="relative flex w-full items-center text-danger"
          title="Archive this todo"
        >
          Archive
          <CrossCircledIcon
            className="ml-auto text-danger"
            width={20}
            height={20}
          />
        </PlainButton>
      </archiveTodoFetcher.Form>
    </Popover.Item>
  );
};
