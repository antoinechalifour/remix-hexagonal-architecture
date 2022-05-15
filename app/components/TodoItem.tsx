import type { TodoDto } from "shared";

import React from "react";
import classNames from "classnames";
import { useFetcher } from "@remix-run/react";
import { CheckboxOption } from "front/ui/CheckboxOption";
import { Button } from "front/ui/Button";
import { EditableContent } from "front/ui/EditableContent";

export interface TodoItemProps {
  todoListId: string;
  todo: TodoDto;
  className?: string;
}

export const TodoItem = React.forwardRef<HTMLDivElement, TodoItemProps>(
  function TodoItem(props, ref) {
    const { todoListId, todo, className } = props;
    const completeTodo = useFetcher();
    const archiveTodo = useFetcher();
    const renameTodo = useFetcher();
    const isArchiving = archiveTodo.state === "submitting";
    const isCompleting = completeTodo.state === "submitting";

    const handleChange = (e: React.ChangeEvent<HTMLFormElement>) =>
      completeTodo.submit(e.currentTarget);

    return (
      <div
        ref={ref}
        className={classNames(
          "grid grid-cols-[auto_1fr_auto] items-center gap-3",
          "rounded-2xl py-4 px-6",
          "bg-dark shadow",
          { "opacity-50": isArchiving || isCompleting },
          className
        )}
      >
        <completeTodo.Form
          method="post"
          action={`/l/${todoListId}/todo/${todo.id}`}
          onChange={handleChange}
          replace
        >
          <CheckboxOption
            id={`todo-${todo.id}`}
            isChecked={todo.isComplete}
            label={
              <span className="sr-only">{todo.title} (click to toggle)</span>
            }
          />
        </completeTodo.Form>

        <renameTodo.Form
          method="post"
          action={`/l/${todoListId}/todo/${todo.id}/rename`}
        >
          <EditableContent
            initialValue={todo.title}
            inputName="title"
            inputClassName="font-semibold"
          >
            <span
              className={classNames("font-semibold sm:ml-2", {
                "line-through opacity-75": todo.isComplete,
              })}
            >
              {todo.title}
            </span>
          </EditableContent>
        </renameTodo.Form>

        <archiveTodo.Form
          method="post"
          action={`/l/${todoListId}/todo/${todo.id}/archive`}
          replace
        >
          <Button
            type="submit"
            disabled={isArchiving}
            title="Archive this todo"
          >
            🗑
          </Button>
        </archiveTodo.Form>
      </div>
    );
  }
);
