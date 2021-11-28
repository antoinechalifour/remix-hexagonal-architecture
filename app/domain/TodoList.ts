import type { Todo } from "./Todo";

import { v4 as uuid } from "uuid";

export type TodoListId = string;

export type TodoList = {
  id: string;
  title: string;
  createdAt: string;
};

export const makeTodoList = (title: string): TodoList => ({
  id: uuid(),
  createdAt: new Date().toISOString(),
  title,
});

export const addTodo = (todoList: TodoList, title: string): Todo => ({
  id: uuid(),
  createdAt: new Date().toISOString(),
  title,
  isComplete: false,
  todoListId: todoList.id,
});
