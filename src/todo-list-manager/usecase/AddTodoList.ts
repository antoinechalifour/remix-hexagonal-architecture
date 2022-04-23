import type { TodoLists } from "../domain/TodoLists";
import type { GenerateId } from "../domain/GenerateId";
import type { Clock } from "../domain/Clock";

import { makeTodoList } from "../domain/TodoList";

export class AddTodoList {
  constructor(
    private readonly todoLists: TodoLists,
    private readonly generateId: GenerateId,
    private readonly clock: Clock
  ) {}

  async execute(title: string) {
    const todoList = makeTodoList(title, this.generateId, this.clock);
    await this.todoLists.save(todoList);

    return `/l/${todoList.id}`;
  }
}
