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
  tags: string[];
};

export const updateCompletion = (todo: Todo, isComplete: boolean) => ({
  ...todo,
  isComplete,
});

export const renameTodo = (todo: Todo, title: string) => ({
  ...todo,
  title,
});

export const tagTodo = (todo: Todo, tag: string) => {
  if (todo.tags.includes(tag)) return todo;
  if (todo.tags.length === 3)
    throw new Error("Todos can only have at most 3 tags");

  return {
    ...todo,
    tags: [...todo.tags, tag],
  };
};

export const untagTodo = (todo: Todo, tagToRemove: string) => ({
  ...todo,
  tags: todo.tags.filter((tag) => tag !== tagToRemove),
});
