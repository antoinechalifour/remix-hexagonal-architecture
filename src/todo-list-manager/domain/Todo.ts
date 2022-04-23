import type { TodoListId } from "./TodoList";

export type TodoId = string;

export type Todo = {
  id: TodoId;
  title: string;
  isComplete: boolean;
  createdAt: string;
  todoListId: TodoListId;
};

export const updateCompletion = (todo: Todo, isComplete: boolean) => ({
  ...todo,
  isComplete,
});
