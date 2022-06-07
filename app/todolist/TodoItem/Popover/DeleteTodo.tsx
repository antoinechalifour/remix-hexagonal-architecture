import type { TodoDto } from "shared/client";
import React from "react";
import { useFetcher } from "@remix-run/react";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { PlainButton } from "front/ui/Button";
import { useTodoListInfo } from "front/todolist/state";

export type DeleteTodoProps = {
  todo: TodoDto;
};

export const DeleteTodo = ({ todo }: DeleteTodoProps) => {
  const deleteTodo = useFetcher();
  const { id } = useTodoListInfo();
  const isArchiving = deleteTodo.state === "submitting";

  return (
    <deleteTodo.Form
      method="post"
      action={`/l/${id}/todo/${todo.id}/delete`}
      replace
      className="flex items-center"
    >
      <PlainButton
        type="submit"
        disabled={isArchiving}
        className="flex w-full items-center text-danger"
        title="Archive this todo"
      >
        Delete
        <CrossCircledIcon className="ml-auto text-danger" />
      </PlainButton>
    </deleteTodo.Form>
  );
};
