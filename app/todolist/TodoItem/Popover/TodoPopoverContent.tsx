import type { TodoDto } from "shared/client";
import React, { useRef } from "react";
import { Popover } from "front/ui/Popover";
import { TagsList } from "front/todolist/TodoItem/Popover/TagsList";
import { AddTag } from "front/todolist/TodoItem/Popover/AddTag";
import { ArchiveTodo } from "front/todolist/TodoItem/Popover/ArchiveTodo";
import { SendToTop } from "front/todolist/TodoItem/Popover/SendToTop";
import { SendToBottom } from "front/todolist/TodoItem/Popover/SendToBottom";

export type TodoPopoverContentProps = {
  todo: TodoDto;
};

export const TodoPopoverContent = ({ todo }: TodoPopoverContentProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closePopOver = () => closeButtonRef.current?.click();

  return (
    <Popover.Content side="right">
      <Popover.Close asChild>
        <button ref={closeButtonRef} className="sr-only">
          Close
        </button>
      </Popover.Close>

      <Popover.SectionTitle className="text-faded">Tags</Popover.SectionTitle>
      <TagsList todo={todo} />
      <AddTag todo={todo} />

      {!todo.isComplete && (
        <>
          <Popover.Separator />
          <Popover.SectionTitle>Actions</Popover.SectionTitle>
          <Popover.Item>
            <SendToTop todo={todo} onDone={closePopOver} />
          </Popover.Item>
          <Popover.Item>
            <SendToBottom todo={todo} onDone={closePopOver} />
          </Popover.Item>
        </>
      )}

      <Popover.Separator />
      <Popover.SectionTitle className="text-danger">
        Danger zone
      </Popover.SectionTitle>

      <Popover.Item>
        <ArchiveTodo todo={todo} />
      </Popover.Item>

      <Popover.Arrow />
    </Popover.Content>
  );
};
