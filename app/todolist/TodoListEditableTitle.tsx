import type { TodoListDetailsDto } from "shared/client";
import React from "react";
import { useFetcher } from "@remix-run/react";
import { EditableContent } from "front/ui/EditableContent";
import { PageTitle } from "front/ui/PageTitle";

export type TodoListEditableTitleProps = { todoList: TodoListDetailsDto };

export const TodoListEditableTitle = ({
  todoList,
}: TodoListEditableTitleProps) => {
  const updateTodoListTitle = useFetcher();

  return (
    <updateTodoListTitle.Form method="post" action={`/l/${todoList.id}/rename`}>
      <EditableContent
        initialValue={todoList.title}
        inputName="title"
        inputClassName="text-2xl font-semibold text-lighter"
      >
        <PageTitle>{todoList.title}</PageTitle>
      </EditableContent>
    </updateTodoListTitle.Form>
  );
};
