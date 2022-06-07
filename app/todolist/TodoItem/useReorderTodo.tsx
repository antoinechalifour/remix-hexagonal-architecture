import type { TodoDto } from "shared/client";

import { useFetcher } from "@remix-run/react";
import { useDrag, useDrop } from "react-dnd";
import { useTodoListInfo } from "front/todolist/state";

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
  todo: TodoDto,
  currentIndex: number,
  onPreviewMove: (todoId: string, newIndex: number) => void
) => {
  const { id } = useTodoListInfo();
  const todosOrder = useFetcher();

  const moveTodo = (newIndex: number) => {
    const formData = new FormData();
    formData.append("todoId", todo.id);
    formData.append("newIndex", newIndex.toString());

    todosOrder.submit(formData, {
      method: "put",
      action: `/l/${id}/reorder-todo`,
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
