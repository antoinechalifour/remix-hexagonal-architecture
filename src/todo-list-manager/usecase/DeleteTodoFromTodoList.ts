import type { ContributorId } from "../domain/ContributorId";
import type { TodoId } from "../domain/Todo";
import type { Todos } from "../domain/Todos";
import type { TodoLists } from "../domain/TodoLists";
import type { TodoListId } from "../domain/TodoList";
import { removeTodoFromOrder } from "../domain/TodoList";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import { canEditTodoList } from "../domain/TodoListPermission";

export class DeleteTodoFromTodoList {
  constructor(
    private readonly todoLists: TodoLists,
    private readonly todoListPermissions: TodoListPermissions,
    private readonly todos: Todos
  ) {}

  async execute(
    todoListId: TodoListId,
    todoId: TodoId,
    contributorId: ContributorId
  ) {
    const permission = await this.todoListPermissions.ofTodoList(todoListId);
    canEditTodoList(permission, contributorId);

    const todoList = await this.todoLists.ofId(todoListId);

    await Promise.all([
      this.todoLists.save(removeTodoFromOrder(todoList, todoId)),
      this.todos.remove(todoId),
    ]);
  }
}
