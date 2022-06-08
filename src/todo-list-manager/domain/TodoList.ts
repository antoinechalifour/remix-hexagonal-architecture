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

export const createTotoList = (
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
    isDone: false,
    doneAt: null,
    todoListId: todoList.id,
    tags: [],
  };

  return [updatedTodoList, createdTodo];
};

export const removeTodoFromOrder = (
  todoList: TodoList,
  todoToRemoveId: TodoId
): TodoList => ({
  ...todoList,
  todosOrder: todoList.todosOrder.filter((todoId) => todoId !== todoToRemoveId),
});

export const reorderTodoInTodoList = (
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

export const insertTodoToFirstPlace = (
  todoList: TodoList,
  todoToInsertId: TodoId
): TodoList => ({
  ...todoList,
  todosOrder: [todoToInsertId, ...todoList.todosOrder],
});

export const updateTodoListTitle = (todoList: TodoList, newTitle: string) => ({
  ...todoList,
  title: newTitle,
});
