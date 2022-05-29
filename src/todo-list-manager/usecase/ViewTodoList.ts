import type { TodoListId } from "../domain/TodoList";
import type { CollaboratorId } from "../domain/CollaboratorId";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import type { TodoListQuery } from "todo-list-manager";
import { canView } from "../domain/TodoListPermission";

export class ViewTodoList {
  constructor(
    private readonly todoListPermissions: TodoListPermissions,
    private readonly todoListQuery: TodoListQuery
  ) {}

  async execute(todoListId: TodoListId, collaboratorId: CollaboratorId) {
    const permissions = await this.todoListPermissions.ofTodoList(todoListId);
    canView(permissions, collaboratorId);

    return this.todoListQuery.ofTodoList(todoListId);
  }
}
