import type { TodoDto } from "shared";
import type { TodoItemProps } from "./TodoItem";

import React from "react";
import { useFetcher } from "@remix-run/react";
import { useDrag, useDrop } from "react-dnd";
import classNames from "classnames";
import { TodoItem } from "./TodoItem";

interface DragItem {
  todoId: string;
}

interface DropResult {
  newIndex: number;
}

interface CollectedProps {
  isDragging: boolean;
}

const DragTypeTodo = Symbol("todo");

const useReorderTodo = (
  todoListId: string,
  todo: TodoDto,
  currentIndex: number,
  onPreviewMove: (todoId: string, newIndex: number) => void
) => {
  const todosOrder = useFetcher();

  const moveTodo = (newIndex: number) => {
    const formData = new FormData();
    formData.append("todoId", todo.id);
    formData.append("newIndex", newIndex.toString());

    todosOrder.submit(formData, {
      method: "put",
      action: `/l/${todoListId}/order`,
    });
  };

  const [{ isDragging }, drag, preview] = useDrag<
    DragItem,
    DropResult,
    CollectedProps
  >({
    type: DragTypeTodo,
    item: { todoId: todo.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult?.newIndex != null) moveTodo(dropResult.newIndex);
    },
  });

  const [, drop] = useDrop<DragItem, DropResult>({
    accept: DragTypeTodo,
    hover: (item, monitor) => {
      onPreviewMove(item.todoId, currentIndex);
    },
    drop: () => ({
      newIndex: currentIndex,
    }),
  });

  return {
    isDragging,
    ref: (node: HTMLDivElement | null) => drag(drop(node)),
    preview,
  };
};

export type ReorderableTodoItemProps = TodoItemProps & {
  index: number;
  onPreviewMove: (todoId: string, newIndex: number) => void;
};

export const ReorderableTodoItem = ({
  index,
  onPreviewMove,
  ...props
}: ReorderableTodoItemProps) => {
  const { ref, preview, isDragging } = useReorderTodo(
    props.todoListId,
    props.todo,
    index,
    onPreviewMove
  );

  return (
    <div className="relative">
      <TodoItem
        {...props}
        className={classNames("pr-16", {
          "opacity-25": isDragging,
        })}
        ref={preview}
      />

      <div
        className="absolute right-0 top-0 flex h-full w-16 cursor-pointer place-content-center items-center"
        ref={ref}
      >
        <span>↕</span>
      </div>
    </div>
  );
};
