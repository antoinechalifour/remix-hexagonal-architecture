import type { TodoLists } from "../domain/TodoLists";
import type { TodoListId } from "../domain/TodoList";
import type { OwnerId } from "../domain/OwnerId";

export class ArchiveTodoList {
  constructor(private readonly todoLists: TodoLists) {}

  async execute(todoListId: TodoListId, ownerId: OwnerId) {
    await this.todoLists.remove(todoListId, ownerId);
  }
}
