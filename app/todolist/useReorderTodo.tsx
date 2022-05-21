import type { TodoDto } from "shared/client";

import { useFetcher } from "@remix-run/react";
import { useDrag, useDrop } from "react-dnd";

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

export const useReorderTodo = (
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
    hover: (item) => {
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
