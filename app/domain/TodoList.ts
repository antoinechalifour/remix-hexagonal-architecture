import type { Todo } from "./Todo";

import { v4 as uuid } from "uuid";
import { Clock } from "~/domain/Clock";
import { GenerateId } from "~/domain/GenerateId";

export type TodoListId = string;

export type TodoList = {
  id: string;
  title: string;
  createdAt: string;
};

export const makeTodoList = (
  title: string,
  generateId: GenerateId,
  clock: Clock
): TodoList => ({
  id: generateId.generate(),
  createdAt: clock.now().toISOString(),
  title,
});

export const addTodo = (todoList: TodoList, title: string): Todo => ({
  id: uuid(),
  createdAt: new Date().toISOString(),
  title,
  isComplete: false,
  todoListId: todoList.id,
});
