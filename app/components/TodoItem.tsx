import type { TodoDto } from "shared";

import React from "react";
import classNames from "classnames";
import { useFetcher } from "@remix-run/react";
import { CheckboxOption } from "front/ui/CheckboxOption";
import { Button } from "front/ui/Button";

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
    const isArchiving = archiveTodo.state === "submitting";
    const isCompleting = completeTodo.state === "submitting";

    const handleChange = (e: React.ChangeEvent<HTMLFormElement>) =>
      completeTodo.submit(e.currentTarget);

    return (
      <div
        ref={ref}
        className={classNames(
          "grid grid-cols-[1fr_auto] items-center gap-3",
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
              <span
                className={classNames({
                  "line-through opacity-75": todo.isComplete,
                })}
              >
                {todo.title}
              </span>
            }
          />
        </completeTodo.Form>

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
