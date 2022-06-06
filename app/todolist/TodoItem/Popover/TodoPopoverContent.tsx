import type { TodoDto } from "shared/client";
import React, { useRef } from "react";
import { Popover } from "front/ui/Popover";
import { TodoTags } from "front/todolist/TodoItem/Popover/TodoTags";
import { TodoActions } from "front/todolist/TodoItem/Popover/TodoActions";
import { TodoDangerZone } from "front/todolist/TodoItem/Popover/TodoDangerZone";

export type TodoPopoverContentProps = {
  todo: TodoDto;
};

export const TodoPopoverContent = ({ todo }: TodoPopoverContentProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closePopOver = () => closeButtonRef.current?.click();

  return (
    <Popover.Content side="right">
      <Popover.Arrow />

      <Popover.Close asChild>
        <button ref={closeButtonRef} className="sr-only">
          Close
        </button>
      </Popover.Close>

      <TodoTags todo={todo} />
      <Popover.Separator />
      <TodoActions todo={todo} onAction={closePopOver} />
      <Popover.Separator />
      <TodoDangerZone todo={todo} />
    </Popover.Content>
  );
};
