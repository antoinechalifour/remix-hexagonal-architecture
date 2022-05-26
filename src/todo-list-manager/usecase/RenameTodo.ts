import type { Todos } from "../domain/Todos";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import type { CollaboratorId } from "../domain/CollaboratorId";
import type { TodoListId } from "../domain/TodoList";
import { renameTodo, TodoId } from "../domain/Todo";
import { canRenameTodo } from "../domain/TodoListPermission";

export class RenameTodo {
  constructor(
    private readonly todos: Todos,
    private readonly todoListPermissions: TodoListPermissions
  ) {}

  async execute(
    todoListId: TodoListId,
    todoId: TodoId,
    title: string,
    collaboratorId: CollaboratorId
  ) {
    const permission = await this.todoListPermissions.ofTodoList(todoListId);
    canRenameTodo(permission, collaboratorId);

    const todo = await this.todos.ofId(todoId, collaboratorId);
    await this.todos.save(renameTodo(todo, title));
  }
}
