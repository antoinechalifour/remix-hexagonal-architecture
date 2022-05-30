import { TodoList, TodoListId } from "./TodoList";
import { OwnerId } from "./OwnerId";
import { CollaboratorId } from "./CollaboratorId";
import { TodoListPermissionDeniedError } from "./TodoListPermissionDeniedError";

export type TodoListPermission = {
  todoListId: TodoListId;
  ownerId: OwnerId;
  collaboratorsIds: CollaboratorId[];
};

export const createPermissions = (
  todoList: TodoList,
  ownerId: OwnerId
): TodoListPermission => ({
  todoListId: todoList.id,
  ownerId: ownerId,
  collaboratorsIds: [],
});

export const shareWithCollaborator = (
  permission: TodoListPermission,
  collaboratorId: CollaboratorId
): TodoListPermission => ({
  ...permission,
  collaboratorsIds: [...permission.collaboratorsIds, collaboratorId],
});

export const isOwner = (
  permission: TodoListPermission,
  collaboratorId: CollaboratorId
) => permission.ownerId === collaboratorId;

export const isCollaborator = (
  permission: TodoListPermission,
  collaboratorId: CollaboratorId
) => permission.collaboratorsIds.includes(collaboratorId);

const verifyIsOwner = (
  permission: TodoListPermission,
  collaboratorId: CollaboratorId
) => {
  if (!isOwner(permission, collaboratorId))
    throw new TodoListPermissionDeniedError(
      permission.todoListId,
      collaboratorId
    );
};

export const verifyIsCollaborator = (
  permission: TodoListPermission,
  collaboratorId: CollaboratorId
) => {
  if (
    !isOwner(permission, collaboratorId) &&
    !isCollaborator(permission, collaboratorId)
  ) {
    throw new TodoListPermissionDeniedError(
      permission.todoListId,
      collaboratorId
    );
  }
};

export const canArchiveTodoList = verifyIsOwner;
export const canEditTodoList = verifyIsCollaborator;
export const canShareTodoList = verifyIsCollaborator;
export const canView = verifyIsCollaborator;
