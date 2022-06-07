import type { TodoLists } from "../domain/TodoLists";
import type { TodoListId } from "../domain/TodoList";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import type { ContributorId } from "../domain/ContributorId";
import { canArchiveTodoList } from "../domain/TodoListPermission";

export class ArchiveTodoList {
  constructor(
    private readonly todoLists: TodoLists,
    private readonly todoListPermissions: TodoListPermissions
  ) {}

  async execute(todoListId: TodoListId, contributorId: ContributorId) {
    const permission = await this.todoListPermissions.ofTodoList(todoListId);
    canArchiveTodoList(permission, contributorId);

    await this.todoListPermissions.remove(permission);
    await this.todoLists.remove(todoListId);
  }
}
