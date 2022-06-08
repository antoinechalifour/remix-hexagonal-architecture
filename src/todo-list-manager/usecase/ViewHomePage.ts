import type { ContributorId } from "../domain/ContributorId";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import type { TodoListQuery } from "../domain/TodoListQuery";

export class ViewHomePage {
  constructor(
    private readonly todoListPermissions: TodoListPermissions,
    private readonly todoListQuery: TodoListQuery
  ) {}

  async execute(contributorId: ContributorId) {
    const permissions = await this.todoListPermissions.ofContributor(
      contributorId
    );

    return this.todoListQuery.summaryOfTodoLists(
      permissions.map((permission) => permission.todoListId)
    );
  }
}
