import type { TodoId } from "../domain/Todo";
import type { Todos } from "../domain/Todos";
import type { OwnerId } from "../domain/OwnerId";

export class ArchiveTodo {
  constructor(private todos: Todos) {}

  async execute(todoId: TodoId, ownerId: OwnerId) {
    await this.todos.remove(todoId, ownerId);
  }
}
