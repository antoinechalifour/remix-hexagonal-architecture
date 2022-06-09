import type { Events } from "shared/events";
import type { ContributorId } from "../domain/ContributorId";
import type { TodoId } from "../domain/Todo";
import type { Todos } from "../domain/Todos";
import type { TodoLists } from "../domain/TodoLists";
import type { TodoListId } from "../domain/TodoList";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import { removeTodoFromOrder } from "../domain/TodoList";
import { canEditTodoList } from "../domain/TodoListPermission";
import { TodoListUpdated } from "../domain/TodoListUpdated";

export class DeleteTodoFromTodoList {
  constructor(
    private readonly todoLists: TodoLists,
    private readonly todoListPermissions: TodoListPermissions,
    private readonly todos: Todos,
    private readonly events: Events
  ) {}

  async execute(
    todoListId: TodoListId,
    todoId: TodoId,
    contributorId: ContributorId
  ) {
    const permission = await this.todoListPermissions.ofTodoList(todoListId);
    canEditTodoList(permission, contributorId);

    const todoList = await this.todoLists.ofId(todoListId);

    await Promise.all([
      this.todoLists.save(removeTodoFromOrder(todoList, todoId)),
      this.todos.remove(todoId),
    ]);

    this.events.publish(new TodoListUpdated(todoListId, contributorId));
  }
}
