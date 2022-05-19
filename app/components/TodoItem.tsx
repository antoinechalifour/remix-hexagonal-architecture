import type { TodoDto } from "shared";

import React from "react";
import classNames from "classnames";
import { useFetcher } from "@remix-run/react";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { CheckboxOption } from "front/ui/CheckboxOption";
import { PlainButton } from "front/ui/Button";
import { EditableContent } from "front/ui/EditableContent";
import { Popover } from "front/ui/Popover";
import { TodoPopoverContent } from "front/components/TodoPopoverContent";
import { TodoTag } from "front/components/TodoTag";

export interface TodoItemProps {
  todoListId: string;
  todo: TodoDto;
  className?: string;
}

export const TodoItem = React.forwardRef<HTMLDivElement, TodoItemProps>(
  function TodoItem(props, ref) {
    const { todoListId, todo, className } = props;
    const completeTodo = useFetcher();
    const renameTodo = useFetcher();
    const isCompleting = completeTodo.state === "submitting";

    const handleChange = (e: React.ChangeEvent<HTMLFormElement>) =>
      completeTodo.submit(e.currentTarget);

    return (
      <div
        ref={ref}
        className={classNames(
          "grid grid-cols-[auto_1fr_auto_auto] items-center gap-3",
          "rounded-2xl py-4 px-6",
          "bg-dark shadow",
          { "opacity-50": isCompleting },
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

        <div className="space-x-2 ">
          {todo.tags.length > 0 &&
            todo.tags.map((tag) => <TodoTag key={tag}>{tag}</TodoTag>)}
        </div>

        <Popover.Root>
          <Popover.Trigger asChild>
            <PlainButton>
              <DotsVerticalIcon />
            </PlainButton>
          </Popover.Trigger>

          <TodoPopoverContent todoListId={todoListId} todo={todo} />
        </Popover.Root>
      </div>
    );
  }
);
