import type { TodoDto } from "shared/client";
import React from "react";
import { Popover } from "front/ui/Popover";
import { SendToTop } from "front/todolist/TodoItem/Popover/SendToTop";
import { SendToBottom } from "front/todolist/TodoItem/Popover/SendToBottom";

export type TodoActionsProps = {
  todo: TodoDto;
  onAction: () => void;
};
export const TodoActions = ({ todo, onAction }: TodoActionsProps) => {
  if (todo.isComplete) return null;

  return (
    <>
      <Popover.SectionTitle>Actions</Popover.SectionTitle>
      <Popover.Item>
        <SendToTop todo={todo} onDone={onAction} />
      </Popover.Item>
      <Popover.Item>
        <SendToBottom todo={todo} onDone={onAction} />
      </Popover.Item>
    </>
  );
};
