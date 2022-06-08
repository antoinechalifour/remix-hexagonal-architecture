import { TodoListPermissions } from "../domain/TodoListPermissions";
import { TodoListId } from "../domain/TodoList";
import { ContributorId } from "../domain/ContributorId";
import { canShareTodoList, revokeAccess } from "../domain/TodoListPermission";

export class RevokeAccess {
  constructor(private readonly todoListPermissions: TodoListPermissions) {}

  async execute(
    todoListId: TodoListId,
    ownerId: ContributorId,
    contributorToRevokeAccess: ContributorId
  ) {
    const permissions = await this.todoListPermissions.ofTodoList(todoListId);
    canShareTodoList(permissions, ownerId);

    await this.todoListPermissions.save(
      revokeAccess(permissions, contributorToRevokeAccess)
    );
  }
}
