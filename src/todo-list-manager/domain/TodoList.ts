import type { GenerateId } from "shared/id";
import type { Clock } from "shared/time";
import type { Todo, TodoId } from "./Todo";

import { moveArrayItem } from "shared/lib";

export type TodoListId = string;

export type TodoList = {
  id: TodoListId;
  title: string;
  createdAt: string;
  todosOrder: TodoId[];
};

export const makeTodoList = (
  title: string,
  generateId: GenerateId,
  clock: Clock
): TodoList => ({
  id: generateId.generate(),
  createdAt: clock.now().toISOString(),
  title,
  todosOrder: [],
});

export const addTodo = (
  todoList: TodoList,
  title: string,
  generateId: GenerateId,
  clock: Clock
): [TodoList, Todo] => {
  const newTodoId = generateId.generate();
  const updatedTodoList = {
    ...todoList,
    todosOrder: [...todoList.todosOrder, newTodoId],
  };
  const createdTodo: Todo = {
    id: newTodoId,
    createdAt: clock.now(),
    title,
    isComplete: false,
    completedAt: null,
    todoListId: todoList.id,
    tags: [],
  };

  return [updatedTodoList, createdTodo];
};

export const removeTodo = (
  todoList: TodoList,
  todoToRemoveId: TodoId
): TodoList => ({
  ...todoList,
  todosOrder: todoList.todosOrder.filter((todoId) => todoId !== todoToRemoveId),
});

export const reorderTodoList = (
  todoList: TodoList,
  todoToReorderId: TodoId,
  newIndex: number
): TodoList => {
  if (newIndex < 0 || newIndex >= todoList.todosOrder.length)
    throw new Error(`Index ${newIndex} is out of bounds`);

  const todoCurrentIndex = todoList.todosOrder.findIndex(
    (todoId) => todoToReorderId === todoId
  );

  if (todoCurrentIndex === -1) {
    throw new Error(`Todo ${todoToReorderId} not found`);
  }

  return {
    ...todoList,
    todosOrder: moveArrayItem(todoList.todosOrder, todoCurrentIndex, newIndex),
  };
};

export const orderAsFirstTodo = () => 0;
export const orderAsLastTodo = (todoOrder: string[]) => todoOrder.length - 1;

export const renameTodoList = (todoList: TodoList, title: string) => ({
  ...todoList,
  title,
});
