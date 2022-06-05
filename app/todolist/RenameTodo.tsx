import type { TodoDto } from "shared/client";
import React, { useEffect } from "react";
import classNames from "classnames";
import { useFetcher } from "@remix-run/react";
import { useOptimisticUpdates, useTodoListInfo } from "front/todolist/state";
import { EditableContent } from "front/ui/EditableContent";

export type RenameTodoProps = { todo: TodoDto };

export const RenameTodo = ({ todo }: RenameTodoProps) => {
  const { id } = useTodoListInfo();
  const { renameTodoFetcher } = useRenameTodo(todo);

  return (
    <renameTodoFetcher.Form
      method="post"
      action={`/l/${id}/todo/${todo.id}/rename`}
    >
      <EditableContent
        initialValue={todo.title}
        inputName="title"
        inputClassName="font-semibold md:ml-2"
      >
        <span
          className={classNames("font-semibold md:ml-2", {
            "line-through opacity-75": todo.isComplete,
          })}
        >
          {todo.title}
        </span>
      </EditableContent>
    </renameTodoFetcher.Form>
  );
};

function useRenameTodo(todo: TodoDto) {
  const renameTodoFetcher = useFetcher();
  const { renameTodo } = useOptimisticUpdates();

  useEffect(() => {
    const submission = renameTodoFetcher.submission;
    if (submission == null) return;
    renameTodo(todo.id, submission.formData.get("title") as string);
  }, [renameTodo, renameTodoFetcher.submission, todo.id]);

  return { renameTodoFetcher };
}
