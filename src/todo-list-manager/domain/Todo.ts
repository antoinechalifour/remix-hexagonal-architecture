import type { Clock } from "shared/time";
import type { TodoListId } from "./TodoList";

export type TodoId = string;

export type Todo = {
  id: TodoId;
  title: string;
  isDone: boolean;
  createdAt: Date;
  doneAt: Date | null;
  todoListId: TodoListId;
  tags: string[];
};

export const markAsDoing = (todo: Todo): Todo => ({
  ...todo,
  isDone: false,
  doneAt: null,
});

export const markAsDone = (todo: Todo, clock: Clock): Todo => ({
  ...todo,
  isDone: true,
  doneAt: clock.now(),
});

export const updateTitle = (todo: Todo, newTitle: string): Todo => ({
  ...todo,
  title: newTitle,
});

export const addTag = (todo: Todo, tagToAdd: string): Todo => {
  if (todo.tags.includes(tagToAdd)) return todo;
  if (todo.tags.length === 3)
    throw new Error("Todos can only have at most 3 tags");

  return {
    ...todo,
    tags: [...todo.tags, tagToAdd],
  };
};

export const removeTag = (todo: Todo, tagToRemove: string): Todo => ({
  ...todo,
  tags: todo.tags.filter((tag) => tag !== tagToRemove),
});
