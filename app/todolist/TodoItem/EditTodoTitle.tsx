import type { TodoDto } from "shared/client";
import React from "react";
import classNames from "classnames";
import { useFetcher } from "@remix-run/react";
import { useIsTodoListStale, useTodoListInfo } from "front/todolist/state";
import { EditableContent } from "front/ui/EditableContent";

export type EditTodoTitleProps = { todo: TodoDto };

export const EditTodoTitle = ({ todo }: EditTodoTitleProps) => {
  const editTodoFetcher = useFetcher();
  const { id } = useTodoListInfo();
  const stale = useIsTodoListStale();

  return (
    <editTodoFetcher.Form
      method="post"
      action={`/l/${id}/todo/${todo.id}/update`}
    >
      <EditableContent
        initialValue={todo.title}
        disabled={stale}
        inputName="title"
        inputClassName="font-semibold md:ml-2"
      >
        <span
          className={classNames("font-semibold md:ml-2", {
            "line-through opacity-75": todo.isDone,
          })}
        >
          {todo.title}
        </span>
      </EditableContent>
    </editTodoFetcher.Form>
  );
};
