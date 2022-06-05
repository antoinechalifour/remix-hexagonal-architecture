import React from "react";
import { useFetcher } from "@remix-run/react";
import { EditableContent } from "front/ui/EditableContent";
import { PageTitle } from "front/ui/PageTitle";
import { useTodoListInfo } from "front/todolist/state";

export const TodoListEditableTitle = () => {
  const { id, title } = useTodoListInfo();
  const updateTodoListTitle = useFetcher();

  return (
    <updateTodoListTitle.Form method="post" action={`/l/${id}/rename`}>
      <EditableContent
        initialValue={title}
        inputName="title"
        inputClassName="text-2xl font-semibold text-lighter"
      >
        <PageTitle>{title}</PageTitle>
      </EditableContent>
    </updateTodoListTitle.Form>
  );
};
