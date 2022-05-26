import { TodoList, TodoListId } from "./TodoList";
import { OwnerId } from "./OwnerId";
import { CollaboratorId } from "./CollaboratorId";

export type TodoListPermission = {
  todoListId: TodoListId;
  ownerId: OwnerId;
};

export const createPermissions = (todoList: TodoList): TodoListPermission => ({
  todoListId: todoList.id,
  ownerId: todoList.ownerId,
});

const isOwner = (
  todoListPermission: TodoListPermission,
  collaboratorId: CollaboratorId
) => {
  if (todoListPermission.ownerId !== collaboratorId)
    throw new Error("Do not have permission");
};

export const canArchiveTodo = isOwner;
export const canArchiveTodoList = isOwner;
export const canAddTodo = isOwner;
export const canChangeTodoCompletion = isOwner;
export const canRenameTodo = isOwner;
