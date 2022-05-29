import { TodoList, TodoListId } from "./TodoList";
import { OwnerId } from "./OwnerId";
import { CollaboratorId } from "./CollaboratorId";
import { TodoListPermissionDenied } from "./TodoListPermissionDenied";

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

export const isCollaborator = (
  todoListPermission: TodoListPermission,
  collaboratorId: CollaboratorId
) => {
  const owner = todoListPermission.ownerId === collaboratorId;
  const collaborator =
    todoListPermission.collaboratorsIds.includes(collaboratorId);

  if (!owner && !collaborator) {
    throw new TodoListPermissionDenied(
      todoListPermission.todoListId,
      collaboratorId
    );
  }
};

export const canArchiveTodoList = isOwner;
export const canEditTodoList = isCollaborator;
export const canShareTodoList = isCollaborator;
export const canView = isCollaborator;
