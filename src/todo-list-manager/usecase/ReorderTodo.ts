import type { Clock } from "shared/time";
import type { Events } from "shared/events";
import type { TodoLists } from "../domain/TodoLists";
import type { TodoListId } from "../domain/TodoList";
import type { TodoId } from "../domain/Todo";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import type { ContributorId } from "../domain/ContributorId";
import { currentTodoOrder, reorderTodoInTodoList } from "../domain/TodoList";
import { canEditTodoList } from "../domain/TodoListPermission";
import { TodoReordered } from "../domain/TodoReordered";

export class ReorderTodo {
  constructor(
    private readonly todoLists: TodoLists,
    private readonly todoListPermissions: TodoListPermissions,
    private readonly clock: Clock,
    private readonly events: Events
  ) {}

  async execute(
    todoListId: TodoListId,
    contributorId: ContributorId,
    todoToReorderId: TodoId,
    newIndex: number
  ) {
    const permission = await this.todoListPermissions.ofTodoList(todoListId);
    canEditTodoList(permission, contributorId);

    const todoList = await this.todoLists.ofId(todoListId);
    const previousOrder = currentTodoOrder(todoList, todoToReorderId);

    await this.todoLists.save(
      reorderTodoInTodoList(todoList, todoToReorderId, newIndex)
    );
    this.events.publish(
      new TodoReordered(
        todoListId,
        contributorId,
        todoToReorderId,
        previousOrder,
        newIndex,
        this.clock.now()
      )
    );
  }
}
