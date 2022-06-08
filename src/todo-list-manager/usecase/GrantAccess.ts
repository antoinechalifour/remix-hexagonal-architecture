import type { TodoListId } from "../domain/TodoList";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import type { Contributors } from "../domain/Contributors";
import type { ContributorId } from "../domain/ContributorId";
import {
  canShareTodoList,
  isContributor,
  grantAccess,
} from "../domain/TodoListPermission";

export class GrantAccess {
  constructor(
    private readonly todoListPermissions: TodoListPermissions,
    private readonly contributors: Contributors
  ) {}

  async execute(
    todoListId: TodoListId,
    contributorId: ContributorId,
    newContributorEmail: string
  ) {
    const permission = await this.todoListPermissions.ofTodoList(todoListId);
    canShareTodoList(permission, contributorId);

    const contributorToGrantAccess = await this.contributors.ofEmail(
      newContributorEmail
    );

    if (!isContributor(permission, contributorToGrantAccess.id)) {
      await this.todoListPermissions.save(
        grantAccess(permission, contributorToGrantAccess.id)
      );
    }
  }
}
