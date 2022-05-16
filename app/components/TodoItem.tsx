import type { TodoDto } from "shared";

import React from "react";
import classNames from "classnames";
import { useFetcher } from "@remix-run/react";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
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
            inputClassName="font-semibold sm:ml-2"
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

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>x</DropdownMenu.Trigger>

          <DropdownMenu.Content className="min-w-[220px] bg-lighter p-4 text-dark">
            <archiveTodo.Form
              method="post"
              action={`/l/${todoListId}/todo/${todo.id}/archive`}
              replace
              className="flex items-center"
            >
              <Button
                type="submit"
                disabled={isArchiving}
                className="flex w-full text-inherit"
                title="Archive this todo"
              >
                Archive
                <CrossCircledIcon
                  className="ml-auto text-danger-lighter"
                  width={20}
                  height={20}
                />
              </Button>
            </archiveTodo.Form>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    );
  }
);
