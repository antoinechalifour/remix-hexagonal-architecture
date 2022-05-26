import { TodoList, TodoListId } from "./TodoList";
import { OwnerId } from "./OwnerId";

export type TodoListPermission = {
  todoListId: TodoListId;
  ownerId: OwnerId;
};

export const createPermissions = (todoList: TodoList): TodoListPermission => ({
  todoListId: todoList.id,
  ownerId: todoList.ownerId,
});

export const canArchive = (
  todoListPermission: TodoListPermission,
  userId: string
) => {
  if (todoListPermission.ownerId !== userId)
    throw new Error("Do not have permission");
};
