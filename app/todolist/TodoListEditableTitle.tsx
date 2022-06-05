import React, { useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import { EditableContent } from "front/ui/EditableContent";
import { PageTitle } from "front/ui/PageTitle";
import { useOptimisticUpdates, useTodoListInfo } from "front/todolist/state";

export const TodoListEditableTitle = () => {
  const { id, title } = useTodoListInfo();
  const { renameTodoListFetcher } = useTodoListeditableTitle();

  return (
    <renameTodoListFetcher.Form method="post" action={`/l/${id}/rename`}>
      <EditableContent
        initialValue={title}
        inputName="title"
        inputClassName="text-2xl font-semibold text-lighter"
      >
        <PageTitle>{title}</PageTitle>
      </EditableContent>
    </renameTodoListFetcher.Form>
  );
};

function useTodoListeditableTitle() {
  const renameTodoListFetcher = useFetcher();
  const { renameTodoList } = useOptimisticUpdates();

  useEffect(() => {
    const submission = renameTodoListFetcher.submission;
    if (submission == null) return;
    renameTodoList(submission.formData.get("title") as string);
  }, [renameTodoList, renameTodoListFetcher.submission]);

  return { renameTodoListFetcher };
}
