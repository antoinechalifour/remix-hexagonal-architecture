import type { TodoLists } from "../domain/TodoLists";
import type { TodoListId } from "../domain/TodoList";
import type { TodoId } from "../domain/Todo";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import type { ContributorId } from "../domain/ContributorId";
import { reorderTodoInTodoList } from "../domain/TodoList";
import { canEditTodoList } from "../domain/TodoListPermission";

export class ReorderTodo {
  constructor(
    private readonly todoLists: TodoLists,
    private readonly todoListPermissions: TodoListPermissions
  ) {}

  async execute(
    todoListId: TodoListId,
    contributorId: ContributorId,
    todoToReorderId: TodoId,
    newIndex: number
  ) {
    const permission = await this.todoListPermissions.ofTodoList(todoListId);
    canEditTodoList(permission, contributorId);

    const todoList = await this.todoLists.ofId(todoListId);
    await this.todoLists.save(
      reorderTodoInTodoList(todoList, todoToReorderId, newIndex)
    );
  }
}
