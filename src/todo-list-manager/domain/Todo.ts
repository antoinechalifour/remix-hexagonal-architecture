import type { Clock } from "shared/time";
import type { TodoListId } from "./TodoList";

export type TodoId = string;

export type Todo = {
  id: TodoId;
  title: string;
  isComplete: boolean;
  createdAt: string;
  completedAt: Date | null;
  todoListId: TodoListId;
  tags: string[];
};

export const updateCompletion = (
  todo: Todo,
  isComplete: boolean,
  clock: Clock
): Todo => ({
  ...todo,
  isComplete,
  completedAt: isComplete ? clock.now() : null,
});

export const renameTodo = (todo: Todo, title: string): Todo => ({
  ...todo,
  title,
});

export const tagTodo = (todo: Todo, tag: string): Todo => {
  if (todo.tags.includes(tag)) return todo;
  if (todo.tags.length === 3)
    throw new Error("Todos can only have at most 3 tags");

  return {
    ...todo,
    tags: [...todo.tags, tag],
  };
};

export const untagTodo = (todo: Todo, tagToRemove: string): Todo => ({
  ...todo,
  tags: todo.tags.filter((tag) => tag !== tagToRemove),
});
