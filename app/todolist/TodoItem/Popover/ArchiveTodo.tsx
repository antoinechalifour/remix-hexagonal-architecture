import type { TodoDto } from "shared/client";
import React from "react";
import { useFetcher } from "@remix-run/react";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { PlainButton } from "front/ui/Button";
import { useTodoListInfo } from "front/todolist/state";

export type ArchiveTodoProps = {
  todo: TodoDto;
};

export const ArchiveTodo = ({ todo }: ArchiveTodoProps) => {
  const archiveTodo = useFetcher();
  const { id } = useTodoListInfo();
  const isArchiving = archiveTodo.state === "submitting";

  return (
    <archiveTodo.Form
      method="post"
      action={`/l/${id}/todo/${todo.id}/archive`}
      replace
      className="flex items-center"
    >
      <PlainButton
        type="submit"
        disabled={isArchiving}
        className="flex w-full items-center text-danger"
        title="Archive this todo"
      >
        Archive
        <CrossCircledIcon className="ml-auto text-danger" />
      </PlainButton>
    </archiveTodo.Form>
  );
};
