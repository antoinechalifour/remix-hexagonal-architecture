import type { TodoListDto } from "shared";

import React from "react";
import { useFetcher } from "@remix-run/react";
import { EditableContent } from "front/ui/EditableContent";
import { PageTitle } from "front/ui/PageTitle";
import { displayDate } from "front/Date";
import { AddTodoForm } from "front/components/AddTodoForm";

export type TodoListHeaderProps = { todoList: TodoListDto };

export const TodoListHeader = ({ todoList }: TodoListHeaderProps) => {
  const updateTodoListTitle = useFetcher();

  return (
    <div className="space-y-4">
      <updateTodoListTitle.Form
        method="post"
        action={`/l/${todoList.id}/rename`}
      >
        <EditableContent
          initialValue={todoList.title}
          inputName="title"
          inputClassName="text-2xl font-semibold text-lighter"
        >
          <PageTitle>{todoList.title}</PageTitle>
        </EditableContent>
      </updateTodoListTitle.Form>

      <p className="pl-3 text-xs">
        ↳ You created this list {displayDate(todoList.createdAt)}
      </p>

      <AddTodoForm />
    </div>
  );
};
