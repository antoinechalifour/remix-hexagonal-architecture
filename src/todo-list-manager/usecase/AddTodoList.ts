import type { GenerateId } from "shared";
import type { TodoLists } from "../domain/TodoLists";
import type { Clock } from "../../shared/Clock";
import type { OwnerId } from "../domain/OwnerId";

import { makeTodoList } from "../domain/TodoList";

export class AddTodoList {
  constructor(
    private readonly todoLists: TodoLists,
    private readonly generateId: GenerateId,
    private readonly clock: Clock
  ) {}

  async execute(title: string, ownerId: OwnerId) {
    const todoList = makeTodoList(title, ownerId, this.generateId, this.clock);
    await this.todoLists.save(todoList);

    return `/l/${todoList.id}`;
  }
}
