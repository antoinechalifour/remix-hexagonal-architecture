import type { TodoLists } from "../domain/TodoLists";
import type { TodoListId } from "../domain/TodoList";
import type { TodoId } from "../domain/Todo";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import type { CollaboratorId } from "../domain/CollaboratorId";
import { reorderTodoList } from "../domain/TodoList";
import { canEditTodoList } from "../domain/TodoListPermission";

export class ReorderTodos {
  constructor(
    private readonly todoLists: TodoLists,
    private readonly todoListPermissions: TodoListPermissions
  ) {}

  async execute(
    todoListId: TodoListId,
    collaboratorId: CollaboratorId,
    todoToReorderId: TodoId,
    newIndex: number
  ) {
    const permission = await this.todoListPermissions.ofTodoList(todoListId);
    canEditTodoList(permission, collaboratorId);

    const todoList = await this.todoLists.ofId(todoListId);
    await this.todoLists.save(
      reorderTodoList(todoList, todoToReorderId, newIndex)
    );
  }
}
