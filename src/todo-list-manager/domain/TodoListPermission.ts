import { TodoList, TodoListId } from "./TodoList";
import { OwnerId } from "./OwnerId";
import { CollaboratorId } from "./CollaboratorId";
import { TodoListPermissionDenied } from "./TodoListPermissionDenied";

export type TodoListPermission = {
  todoListId: TodoListId;
  ownerId: OwnerId;
  collaboratorIds: CollaboratorId[];
};

export const createPermissions = (
  todoList: TodoList,
  ownerId: OwnerId
): TodoListPermission => ({
  todoListId: todoList.id,
  ownerId: ownerId,
  collaboratorIds: [],
});

export const shareWithCollaborator = (
  permission: TodoListPermission,
  collaboratorId: CollaboratorId
): TodoListPermission => ({
  ...permission,
  collaboratorIds: [...permission.collaboratorIds, collaboratorId],
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
export const canShareTodoList = isOwner;
export const canArchiveTodoList = isOwner;
