import type { TodoDto, TodoListDetailsDto } from "shared/client";
import React from "react";
import { useFetcher } from "@remix-run/react";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { PlainButton } from "front/ui/Button";

export type ArchiveTodoProps = {
  todoList: TodoListDetailsDto;
  todo: TodoDto;
};

export const ArchiveTodo = ({ todoList, todo }: ArchiveTodoProps) => {
  const archiveTodo = useFetcher();
  const isArchiving = archiveTodo.state === "submitting";

  return (
    <archiveTodo.Form
      method="post"
      action={`/l/${todoList.id}/todo/${todo.id}/archive`}
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
        <CrossCircledIcon
          className="ml-auto text-danger"
          width={20}
          height={20}
        />
      </PlainButton>
    </archiveTodo.Form>
  );
};
