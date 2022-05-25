import type { TodoItemProps } from "./TodoItem";
import { TodoItem } from "./TodoItem";

import React from "react";
import { DragHandleHorizontalIcon } from "@radix-ui/react-icons";
import classNames from "classnames";
import { useReorderTodo } from "front/todolist/useReorderTodo";

export type ReorderableTodoItemProps = TodoItemProps & {
  index: number;
  enabled: boolean;
  onPreviewMove: (todoId: string, newIndex: number) => void;
};

export const ReorderableTodoItem = ({
  index,
  onPreviewMove,
  enabled,
  ...props
}: ReorderableTodoItemProps) => {
  const { ref, preview, isDragging } = useReorderTodo(
    props.todoList.id,
    props.todo,
    index,
    onPreviewMove
  );

  return (
    <div className="relative">
      <TodoItem
        {...props}
        className={classNames({
          "md:pl-16": enabled,
          "opacity-25": isDragging,
        })}
        ref={preview}
      />

      {enabled && (
        <div
          className="absolute left-0 top-0 hidden h-full w-16 cursor-pointer justify-center py-4 md:flex"
          ref={ref}
        >
          <DragHandleHorizontalIcon width={20} height={20} />
        </div>
      )}
    </div>
  );
};
