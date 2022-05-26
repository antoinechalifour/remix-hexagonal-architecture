import type { CollaboratorId } from "../domain/CollaboratorId";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import type { TodoLists } from "../domain/TodoLists";
import { renameTodoList, TodoListId } from "../domain/TodoList";
import { canEditTodoList } from "../domain/TodoListPermission";

export class RenameTodoList {
  constructor(
    private readonly todoLists: TodoLists,
    private readonly todoListPermissions: TodoListPermissions
  ) {}

  async execute(
    todoListId: TodoListId,
    title: string,
    collaboratorId: CollaboratorId
  ) {
    const permission = await this.todoListPermissions.ofTodoList(todoListId);
    canEditTodoList(permission, collaboratorId);

    const todoList = await this.todoLists.ofId(todoListId, collaboratorId);
    await this.todoLists.save(renameTodoList(todoList, title));
  }
}
