import type { Todos } from "../domain/Todos";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import type { ContributorId } from "../domain/ContributorId";
import type { TodoListId } from "../domain/TodoList";
import { updateTitle, TodoId } from "../domain/Todo";
import { canEditTodoList } from "../domain/TodoListPermission";

export class UpdateTodoTitle {
  constructor(
    private readonly todos: Todos,
    private readonly todoListPermissions: TodoListPermissions
  ) {}

  async execute(
    todoListId: TodoListId,
    todoId: TodoId,
    title: string,
    contributorId: ContributorId
  ) {
    const permission = await this.todoListPermissions.ofTodoList(todoListId);
    canEditTodoList(permission, contributorId);

    const todo = await this.todos.ofId(todoId);
    await this.todos.save(updateTitle(todo, title));
  }
}
