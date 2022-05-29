import { CollaboratorId } from "../domain/CollaboratorId";
import { TodoListPermissions } from "../domain/TodoListPermissions";
import { TodoListsSummaryQuery } from "todo-list-manager";

export class ViewHomePage {
  constructor(
    private readonly todoListPermissions: TodoListPermissions,
    private readonly todoListsSummaryQuery: TodoListsSummaryQuery
  ) {}

  async execute(collaboratorId: CollaboratorId) {
    const permissions = await this.todoListPermissions.ofCollaborator(
      collaboratorId
    );

    return this.todoListsSummaryQuery.ofTodoLists(
      permissions.map((permission) => permission.todoListId)
    );
  }
}
