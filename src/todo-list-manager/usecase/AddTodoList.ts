import type { GenerateId } from "shared/id";
import type { Clock } from "shared/time";
import type { TodoLists } from "../domain/TodoLists";
import type { OwnerId } from "../domain/OwnerId";
import type { TodoListPermissions } from "../domain/TodoListPermissions";

import { makeTodoList } from "../domain/TodoList";
import { createPermissions } from "../domain/TodoListPermission";

export class AddTodoList {
  constructor(
    private readonly todoLists: TodoLists,
    private readonly todoListPermissions: TodoListPermissions,
    private readonly generateId: GenerateId,
    private readonly clock: Clock
  ) {}

  async execute(title: string, ownerId: OwnerId) {
    const todoList = makeTodoList(title, ownerId, this.generateId, this.clock);
    const todoListPermissions = createPermissions(todoList);

    await Promise.all([
      this.todoLists.save(todoList),
      this.todoListPermissions.save(todoListPermissions),
    ]);

    return `/l/${todoList.id}`;
  }
}
