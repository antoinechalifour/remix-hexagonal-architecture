import type { Events } from "shared/events";
import type { ContributorId } from "../domain/ContributorId";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import type { TodoLists } from "../domain/TodoLists";
import { updateTodoListTitle, TodoListId } from "../domain/TodoList";
import { canEditTodoList } from "../domain/TodoListPermission";
import { TodoListUpdated } from "../domain/TodoListUpdated";

export class UpdateTodoListTitle {
  constructor(
    private readonly todoLists: TodoLists,
    private readonly todoListPermissions: TodoListPermissions,
    private readonly events: Events
  ) {}

  async execute(
    todoListId: TodoListId,
    title: string,
    contributorId: ContributorId
  ) {
    const permission = await this.todoListPermissions.ofTodoList(todoListId);
    canEditTodoList(permission, contributorId);

    const todoList = await this.todoLists.ofId(todoListId);
    await this.todoLists.save(updateTodoListTitle(todoList, title));
    this.events.publish(new TodoListUpdated(todoListId, contributorId));
  }
}
