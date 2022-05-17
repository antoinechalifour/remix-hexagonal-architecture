import type { Todo, TodoId } from "./Todo";
import type { GenerateId } from "shared";
import type { OwnerId } from "./OwnerId";

import { moveArrayItem } from "shared";
import { Clock } from "../../shared/Clock";

export type TodoListId = string;

export type TodoList = {
  id: TodoListId;
  title: string;
  createdAt: string;
  ownerId: OwnerId;
  todosOrder: TodoId[];
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
    createdAt: clock.now().toISOString(),
    title,
    isComplete: false,
    todoListId: todoList.id,
    ownerId: todoList.ownerId,
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
