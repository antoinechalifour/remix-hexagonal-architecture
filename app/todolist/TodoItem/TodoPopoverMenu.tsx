import type { TodoDto } from "shared/client";
import React from "react";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Popover } from "front/ui/Popover";
import { PlainButton } from "front/ui/Button";
import { useIsTodoListStale } from "front/todolist/state";
import { TodoPopoverContent } from "front/todolist/TodoItem/Popover/TodoPopoverContent";

export type TodoPopoverMenuProps = { todo: TodoDto };

export const TodoPopoverMenu = ({ todo }: TodoPopoverMenuProps) => {
  const stale = useIsTodoListStale();

  if (stale) return null;

  return (
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
  );
};
