import type { Events } from "shared/events";
import type { ContributorId } from "../domain/ContributorId";
import type { Todos } from "../domain/Todos";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import type { TodoListId } from "../domain/TodoList";
import { addTag, TodoId } from "../domain/Todo";
import { canEditTodoList } from "../domain/TodoListPermission";
import { TodoListUpdated } from "../domain/TodoListUpdated";

export class AddTagToTodo {
  constructor(
    private readonly todos: Todos,
    private readonly todoListPermissions: TodoListPermissions,
    private readonly events: Events
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
    await this.todos.save(addTag(todo, tag));
    this.events.publish(new TodoListUpdated(todoListId, contributorId));
  }
}
