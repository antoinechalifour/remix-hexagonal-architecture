import type { TodoListId } from "~/domain/TodoList";

export const todoListNotFound = (todoListId: TodoListId) => {
  throw new Response(`Todo list "${todoListId}" was not found.`);
};
