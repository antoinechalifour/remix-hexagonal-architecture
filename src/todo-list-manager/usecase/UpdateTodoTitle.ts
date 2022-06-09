import type { Clock } from "shared/time";
import type { Events } from "shared/events";
import type { Todos } from "../domain/Todos";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import type { ContributorId } from "../domain/ContributorId";
import type { TodoListId } from "../domain/TodoList";
import { updateTitle, TodoId } from "../domain/Todo";
import { canEditTodoList } from "../domain/TodoListPermission";
import { TodoListUpdated } from "../domain/TodoListUpdated";

export class UpdateTodoTitle {
  constructor(
    private readonly todos: Todos,
    private readonly todoListPermissions: TodoListPermissions,
    private readonly clock: Clock,
    private readonly events: Events
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
    this.events.publish(
      new TodoListUpdated(todoListId, contributorId, this.clock.now())
    );
  }
}
