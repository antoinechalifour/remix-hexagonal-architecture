import type { TodoListPermission } from "../../../domain/TodoListPermission";
import type { TodoListId } from "../../../domain/TodoList";
import type { OwnerId } from "../../../domain/OwnerId";
import type { ContributorId } from "../../../domain/ContributorId";

export interface TodoListPermissionBuilder {
  todoListPermission: TodoListPermission;
  forTodoList(todoListId: TodoListId): TodoListPermissionBuilder;
  forOwner(ownerId: OwnerId): TodoListPermissionBuilder;
  withContributors(
    ...contributorsIds: ContributorId[]
  ): TodoListPermissionBuilder;
  withNewContributors(
    ...contributorsIds: ContributorId[]
  ): TodoListPermissionBuilder;
  build(): TodoListPermission;
}

export const aTodoListPermission = (): TodoListPermissionBuilder => ({
  todoListPermission: {
    todoListId: "todoList/1",
    ownerId: "owner/1",
    contributorsIds: [],
  },
  forTodoList(todoListId: TodoListId): TodoListPermissionBuilder {
    this.todoListPermission.todoListId = todoListId;
    return this;
  },
  forOwner(ownerId: OwnerId): TodoListPermissionBuilder {
    this.todoListPermission.ownerId = ownerId;
    return this;
  },
  withContributors(
    ...contributorsIds: ContributorId[]
  ): TodoListPermissionBuilder {
    this.todoListPermission.contributorsIds = contributorsIds;
    return this;
  },
  withNewContributors(...contributorsIds: ContributorId[]) {
    this.todoListPermission.contributorsIds.push(...contributorsIds);
    return this;
  },
  build(): TodoListPermission {
    return this.todoListPermission;
  },
});
