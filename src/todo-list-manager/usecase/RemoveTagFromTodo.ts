import type { ContributorId } from "../domain/ContributorId";
import type { Todos } from "../domain/Todos";
import type { TodoListId } from "../domain/TodoList";
import type { TodoListPermissions } from "../domain/TodoListPermissions";

import { TodoId, removeTag } from "../domain/Todo";
import { canEditTodoList } from "../domain/TodoListPermission";

export class RemoveTagFromTodo {
  constructor(
    private readonly todos: Todos,
    private readonly todoListPermissions: TodoListPermissions
  ) {}

  async execute(
    todoListId: TodoListId,
    todoId: TodoId,
    contributorId: ContributorId,
    tag: string
  ) {
    const permission = await this.todoListPermissions.ofTodoList(todoListId);
    canEditTodoList(permission, contributorId);

    const todo = await this.todos.ofId(todoId);
    await this.todos.save(removeTag(todo, tag));
  }
}
