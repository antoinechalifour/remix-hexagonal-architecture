import type { TodoDto } from "shared/client";

import React from "react";
import classNames from "classnames";
import { useFetcher } from "@remix-run/react";
import { CheckboxOption } from "front/ui/CheckboxOption";
import { useIsTodoListStale, useTodoListInfo } from "front/todolist/state";
import { EditTodoTitle } from "front/todolist/TodoItem/EditTodoTitle";
import { TodoPopoverMenu } from "front/todolist/TodoItem/TodoPopoverMenu";
import { TodoTags } from "front/todolist/TodoItem/TodoTags";

export interface TodoItemProps {
  todo: TodoDto;
  className?: string;
}

export const TodoItem = React.forwardRef<HTMLDivElement, TodoItemProps>(
  function TodoItem(props, ref) {
    const { todo, className } = props;
    const { id } = useTodoListInfo();
    const stale = useIsTodoListStale();
    const markTodoFetcher = useFetcher();
    const isBusy = markTodoFetcher.state !== "idle";

    const handleChange = (e: React.ChangeEvent<HTMLFormElement>) =>
      markTodoFetcher.submit(e.currentTarget);

    return (
      <div
        ref={ref}
        className={classNames(
          "grid items-center gap-x-3 gap-y-1",
          "grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto_auto]",
          "grid-rows-[auto_auto] md:grid-rows-1",
          "rounded-2xl p-3 md:px-6 md:py-4",
          "bg-dark shadow",
          { "opacity-50": isBusy },
          className
        )}
      >
        <markTodoFetcher.Form
          method="post"
          action={`/l/${id}/todo/${todo.id}`}
          onChange={handleChange}
          className="row-span-2 self-start md:row-span-1"
          replace
        >
          <CheckboxOption
            id={`todo-${todo.id}`}
            checked={todo.isDone}
            disabled={stale}
            label={
              <span className="sr-only">{todo.title} (click to toggle)</span>
            }
          />
        </markTodoFetcher.Form>

        <EditTodoTitle todo={todo} />
        <TodoTags todo={todo} />
        <TodoPopoverMenu todo={todo} />
      </div>
    );
  }
);
