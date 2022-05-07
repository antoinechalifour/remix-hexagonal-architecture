import type { TodoListId } from "./TodoList";
import type { OwnerId } from "./OwnerId";

export type TodoId = string;

export type Todo = {
  id: TodoId;
  title: string;
  isComplete: boolean;
  createdAt: string;
  todoListId: TodoListId;
  ownerId: OwnerId;
};

export const updateCompletion = (todo: Todo, isComplete: boolean) => ({
  ...todo,
  isComplete,
});
