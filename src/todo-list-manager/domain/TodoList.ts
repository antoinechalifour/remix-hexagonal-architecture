import type { Todo } from "./Todo";
import type { GenerateId } from "shared";
import type { OwnerId } from "./OwnerId";

import { Clock } from "./Clock";

export type TodoListId = string;

export type TodoList = {
  id: TodoListId;
  title: string;
  createdAt: string;
  ownerId: OwnerId;
};

export const makeTodoList = (
  title: string,
  ownerId: OwnerId,
  generateId: GenerateId,
  clock: Clock
): TodoList => ({
  id: generateId.generate(),
  createdAt: clock.now().toISOString(),
  title,
  ownerId,
});

export const addTodo = (
  todoList: TodoList,
  title: string,
  generateId: GenerateId,
  clock: Clock
): Todo => ({
  id: generateId.generate(),
  createdAt: clock.now().toISOString(),
  title,
  isComplete: false,
  todoListId: todoList.id,
  ownerId: todoList.ownerId,
});
