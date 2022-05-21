import type { TodoDto, TodoListDto } from "shared/client";

import { moveArrayItem } from "shared/lib";
import { useEffect, useState } from "react";

interface TodoOrderPreview {
  todoId: string;
  newIndex: number;
}

export function useTodosOrderPreview(todoList: TodoListDto) {
  const [todoOrderPreview, setTodoOrderPreview] =
    useState<TodoOrderPreview | null>(null);
  const reorderForPreview = (todoId: string, newIndex: number) =>
    setTodoOrderPreview({ todoId, newIndex });

  useEffect(() => {
    setTodoOrderPreview(null);
  }, [todoList]);

  const sortForPreview = (todos: TodoDto[]) =>
    sortTodos(todos, todoOrderPreview);

  return { reorderForPreview, sortForPreview };
}

function sortTodos(todos: TodoDto[], orderPreview: TodoOrderPreview | null) {
  if (orderPreview == null) return todos;

  const currentIndex = todos.findIndex(
    (todo) => todo.id === orderPreview.todoId
  );

  if (currentIndex === -1) return todos;
  return moveArrayItem(todos, currentIndex, orderPreview.newIndex);
}
