import type { CollaboratorId } from "../domain/CollaboratorId";
import type { TodoId } from "../domain/Todo";
import type { Todos } from "../domain/Todos";
import type { TodoLists } from "../domain/TodoLists";
import type { TodoListId } from "../domain/TodoList";
import { removeTodoOrder } from "../domain/TodoList";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import { canEditTodoList } from "../domain/TodoListPermission";

export class ArchiveTodo {
  constructor(
    private readonly todoLists: TodoLists,
    private readonly todoListPermissions: TodoListPermissions,
    private readonly todos: Todos
  ) {}

  async execute(
    todoListId: TodoListId,
    todoId: TodoId,
    collaboratorId: CollaboratorId
  ) {
    const permission = await this.todoListPermissions.ofTodoList(todoListId);
    canEditTodoList(permission, collaboratorId);

    const todoList = await this.todoLists.ofId(todoListId);

    await Promise.all([
      this.todoLists.save(removeTodoOrder(todoList, todoId)),
      this.todos.remove(todoId),
    ]);
  }
}
