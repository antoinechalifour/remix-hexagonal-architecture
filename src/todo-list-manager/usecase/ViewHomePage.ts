import type { CollaboratorId } from "../domain/CollaboratorId";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import type { TodoListQuery } from "../domain/TodoListQuery";

export class ViewHomePage {
  constructor(
    private readonly todoListPermissions: TodoListPermissions,
    private readonly todoListQuery: TodoListQuery
  ) {}

  async execute(collaboratorId: CollaboratorId) {
    const permissions = await this.todoListPermissions.ofCollaborator(
      collaboratorId
    );

    return this.todoListQuery.summaryOfTodoLists(
      permissions.map((permission) => permission.todoListId)
    );
  }
}
