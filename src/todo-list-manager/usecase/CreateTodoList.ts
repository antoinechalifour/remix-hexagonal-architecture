import type { GenerateId } from "shared/id";
import type { Clock } from "shared/time";
import type { TodoLists } from "../domain/TodoLists";
import type { OwnerId } from "../domain/OwnerId";
import type { TodoListPermissions } from "../domain/TodoListPermissions";

import { createTotoList } from "../domain/TodoList";
import { createPermissions } from "../domain/TodoListPermission";

export class CreateTodoList {
  constructor(
    private readonly todoLists: TodoLists,
    private readonly todoListPermissions: TodoListPermissions,
    private readonly generateId: GenerateId,
    private readonly clock: Clock
  ) {}

  async execute(title: string, ownerId: OwnerId) {
    const todoList = createTotoList(title, this.generateId, this.clock);
    const todoListPermissions = createPermissions(todoList, ownerId);

    await this.todoLists.save(todoList);
    await this.todoListPermissions.save(todoListPermissions);

    return todoList.id;
  }
}
