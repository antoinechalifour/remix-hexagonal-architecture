import type { TodoDto } from "shared/client";

import React from "react";
import classNames from "classnames";
import { useFetcher } from "@remix-run/react";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { CheckboxOption } from "front/ui/CheckboxOption";
import { PlainButton } from "front/ui/Button";
import { EditableContent } from "front/ui/EditableContent";
import { Popover } from "front/ui/Popover";
import { TodoPopoverContent } from "front/todolist/TodoPopoverContent";
import { TodoTag } from "front/todolist/TodoTag";
import { useTodoListInfo } from "front/todolist/state";

export interface TodoItemProps {
  todo: TodoDto;
  className?: string;
}

export const TodoItem = React.forwardRef<HTMLDivElement, TodoItemProps>(
  function TodoItem(props, ref) {
    const { todo, className } = props;
    const { id } = useTodoListInfo();
    const completeTodo = useFetcher();
    const renameTodo = useFetcher();
    const isCompleting =
      completeTodo.state === "submitting" || completeTodo.state === "loading";

    const handleChange = (e: React.ChangeEvent<HTMLFormElement>) =>
      completeTodo.submit(e.currentTarget);

    return (
      <div
        ref={ref}
        className={classNames(
          "grid items-center gap-x-3 gap-y-1",
          "grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto_auto]",
          "grid-rows-[auto_auto] md:grid-rows-1",
          "rounded-2xl p-3 md:px-6 md:py-4",
          "bg-dark shadow",
          { "opacity-50": isCompleting },
          className
        )}
      >
        <completeTodo.Form
          method="post"
          action={`/l/${id}/todo/${todo.id}`}
          onChange={handleChange}
          className="row-span-2 self-start md:row-span-1"
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
        </renameTodo.Form>

        <ul
          className={classNames(
            "col-start-2 row-start-2 md:col-start-3 md:row-start-1",
            "flex flex-wrap sm:space-x-1"
          )}
        >
          {todo.tags.map((tag) => (
            <li key={tag} className="p-1 sm:p-0">
              <TodoTag>{tag}</TodoTag>
            </li>
          ))}
        </ul>

        <Popover.Root>
          <Popover.Trigger
            asChild
            className="row-span-2 self-start md:row-span-1 md:self-center"
          >
            <PlainButton className="h-6 w-6">
              <DotsVerticalIcon className="mx-auto" />
            </PlainButton>
          </Popover.Trigger>

          <TodoPopoverContent todo={todo} />
        </Popover.Root>
      </div>
    );
  }
);
