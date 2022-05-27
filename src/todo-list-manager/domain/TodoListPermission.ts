import { TodoList, TodoListId } from "./TodoList";
import { OwnerId } from "./OwnerId";
import { CollaboratorId } from "./CollaboratorId";
import { TodoListPermissionDenied } from "./TodoListPermissionDenied";

export type TodoListPermission = {
  todoListId: TodoListId;
  ownerId: OwnerId;
};

export const createPermissions = (
  todoList: TodoList,
  ownerId: OwnerId
): TodoListPermission => ({
  todoListId: todoList.id,
  ownerId: ownerId,
});

const isOwner = (
  todoListPermission: TodoListPermission,
  collaboratorId: CollaboratorId
) => {
  if (todoListPermission.ownerId !== collaboratorId)
    throw new TodoListPermissionDenied(
      todoListPermission.todoListId,
      collaboratorId
    );
};

export const canEditTodoList = isOwner;
export const canArchiveTodoList = isOwner;
