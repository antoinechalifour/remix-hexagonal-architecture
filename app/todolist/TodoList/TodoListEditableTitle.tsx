import React from "react";
import { useFetcher } from "@remix-run/react";
import { EditableContent } from "front/ui/EditableContent";
import { PageTitle } from "front/ui/PageTitle";
import { useTodoListInfo, useIsTodoListStale } from "front/todolist/state";

export const TodoListEditableTitle = () => {
  const { id, title } = useTodoListInfo();
  const stale = useIsTodoListStale();
  const updateTodoListFetcher = useFetcher();

  return (
    <updateTodoListFetcher.Form method="post" action={`/l/${id}/update`}>
      <EditableContent
        initialValue={title}
        inputName="title"
        disabled={stale}
        inputClassName="text-2xl font-semibold text-lighter"
      >
        <PageTitle>{title}</PageTitle>
      </EditableContent>
    </updateTodoListFetcher.Form>
  );
};
