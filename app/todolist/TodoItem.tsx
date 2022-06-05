import type { TodoDto } from "shared/client";

import React from "react";
import classNames from "classnames";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { PlainButton } from "front/ui/Button";
import { Popover } from "front/ui/Popover";
import { TodoPopoverContent } from "front/todolist/TodoPopoverContent";
import { TodoTag } from "front/todolist/TodoTag";
import { CompleteTodo } from "front/todolist/CompleteTodo";
import { RenameTodo } from "front/todolist/RenameTodo";

export interface TodoItemProps {
  todo: TodoDto;
  className?: string;
}

export const TodoItem = React.forwardRef<HTMLDivElement, TodoItemProps>(
  function TodoItem(props, ref) {
    const { todo, className } = props;

    return (
      <div
        ref={ref}
        className={classNames(
          "grid items-center gap-x-3 gap-y-1",
          "grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto_auto]",
          "grid-rows-[auto_auto] md:grid-rows-1",
          "rounded-2xl p-3 md:px-6 md:py-4",
          "bg-dark shadow",
          className
        )}
      >
        <CompleteTodo todo={todo} />

        <RenameTodo todo={todo} />

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
