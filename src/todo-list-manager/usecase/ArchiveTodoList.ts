import type { TodoLists } from "../domain/TodoLists";
import type { TodoListId } from "../domain/TodoList";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import type { CollaboratorId } from "../domain/CollaboratorId";
import { canArchiveTodoList } from "../domain/TodoListPermission";

export class ArchiveTodoList {
  constructor(
    private readonly todoLists: TodoLists,
    private readonly todoListPermissions: TodoListPermissions
  ) {}

  async execute(todoListId: TodoListId, collaboratorId: CollaboratorId) {
    const permission = await this.todoListPermissions.ofTodoList(todoListId);
    canArchiveTodoList(permission, collaboratorId);

    await this.todoLists.remove(todoListId);
  }
}
