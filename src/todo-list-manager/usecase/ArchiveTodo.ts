import type { TodoId } from "../domain/Todo";
import type { Todos } from "../domain/Todos";
import type { TodoLists } from "../domain/TodoLists";
import type { TodoListId } from "../domain/TodoList";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import { removeTodo } from "../domain/TodoList";
import { canArchive } from "../domain/TodoListPermission";
import { CollaboratorId } from "../domain/CollaboratorId";

export class ArchiveTodo {
  constructor(
    private todoLists: TodoLists,
    private readonly todoListPermissions: TodoListPermissions,
    private todos: Todos
  ) {}

  async execute(
    todoListId: TodoListId,
    todoId: TodoId,
    collaboratorId: CollaboratorId
  ) {
    const permissions = await this.todoListPermissions.ofTodoList(todoListId);
    canArchive(permissions, collaboratorId);
    const todoList = await this.todoLists.ofId(todoListId, collaboratorId);

    await Promise.all([
      this.todoLists.save(removeTodo(todoList, todoId)),
      this.todos.remove(todoId, collaboratorId),
    ]);
  }
}
