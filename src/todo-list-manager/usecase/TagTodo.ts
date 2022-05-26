import type { CollaboratorId } from "../domain/CollaboratorId";
import type { Todos } from "../domain/Todos";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import type { TodoListId } from "../domain/TodoList";
import { tagTodo, TodoId } from "../domain/Todo";
import { canEditTodoList } from "../domain/TodoListPermission";

export class TagTodo {
  constructor(
    private readonly todos: Todos,
    private readonly todoListPermissions: TodoListPermissions
  ) {}

  async execute(
    todoListId: TodoListId,
    todoId: TodoId,
    collaboratorId: CollaboratorId,
    tag: string
  ) {
    const permission = await this.todoListPermissions.ofTodoList(todoListId);
    canEditTodoList(permission, collaboratorId);

    const todo = await this.todos.ofId(todoId, collaboratorId);
    await this.todos.save(tagTodo(todo, tag));
  }
}
