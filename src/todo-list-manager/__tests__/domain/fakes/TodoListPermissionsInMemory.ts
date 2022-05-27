import type { TodoListPermissions } from "../../../domain/TodoListPermissions";
import type { TodoListId } from "../../../domain/TodoList";
import type { TodoListPermission } from "../../../domain/TodoListPermission";

export class TodoListPermissionsInMemory implements TodoListPermissions {
  private __database = new Map<TodoListId, TodoListPermission>();

  async ofTodoList(todoListId: TodoListId): Promise<TodoListPermission> {
    const todoListPermission = this.__database.get(todoListId);
    if (!todoListPermission)
      throw new Error(`Not permissions found for todolist ${todoListId}`);

    return todoListPermission;
  }

  async save(todoListPermission: TodoListPermission): Promise<void> {
    this.__database.set(todoListPermission.todoListId, todoListPermission);
  }

  async remove(todoListPermission: TodoListPermission): Promise<void> {
    this.__database.delete(todoListPermission.todoListId);
  }
}
