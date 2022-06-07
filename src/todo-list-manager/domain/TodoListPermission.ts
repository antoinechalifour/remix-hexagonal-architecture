import { TodoList, TodoListId } from "./TodoList";
import { OwnerId } from "./OwnerId";
import { ContributorId } from "./ContributorId";
import { TodoListPermissionDeniedError } from "./TodoListPermissionDeniedError";
import { Contributor } from "./Contributor";

export type TodoListPermission = {
  todoListId: TodoListId;
  ownerId: OwnerId;
  contributorsIds: ContributorId[];
};

export type Role = "owner" | "contributor";

export const createPermissions = (
  todoList: TodoList,
  ownerId: OwnerId
): TodoListPermission => ({
  todoListId: todoList.id,
  ownerId: ownerId,
  contributorsIds: [],
});

export const grantAccess = (
  permission: TodoListPermission,
  contributorId: ContributorId
): TodoListPermission => ({
  ...permission,
  contributorsIds: [...permission.contributorsIds, contributorId],
});

export const revokeAccess = (
  permission: TodoListPermission,
  contributorToRemove: ContributorId
): TodoListPermission => ({
  ...permission,
  contributorsIds: permission.contributorsIds.filter(
    (contributorId) => contributorId !== contributorToRemove
  ),
});

export const isOwner = (
  permission: TodoListPermission,
  contributorId: ContributorId
) => permission.ownerId === contributorId;

export const isContributor = (
  permission: TodoListPermission,
  contributorId: ContributorId
) => permission.contributorsIds.includes(contributorId);

const verifyIsOwner = (
  permission: TodoListPermission,
  contributorId: ContributorId
) => {
  if (!isOwner(permission, contributorId))
    throw new TodoListPermissionDeniedError(
      permission.todoListId,
      contributorId
    );
};

export const verifyIsContributor = (
  permission: TodoListPermission,
  contributorId: ContributorId
) => {
  if (
    !isOwner(permission, contributorId) &&
    !isContributor(permission, contributorId)
  ) {
    throw new TodoListPermissionDeniedError(
      permission.todoListId,
      contributorId
    );
  }
};

export const canArchiveTodoList = verifyIsOwner;
export const canEditTodoList = verifyIsContributor;
export const canShareTodoList = verifyIsContributor;
export const canView = verifyIsContributor;

export const getRole = (
  contributor: Contributor,
  permission: TodoListPermission
): Role => (permission.ownerId === contributor.id ? "owner" : "contributor");
