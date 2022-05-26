import { TodoList, TodoListId } from "./TodoList";
import { OwnerId } from "./OwnerId";

export type TodoListPermission = {
  todoListId: TodoListId;
  ownerId: OwnerId;
};

export const createForTodoList = (todoList: TodoList): TodoListPermission => ({
  todoListId: todoList.id,
  ownerId: todoList.ownerId,
});
