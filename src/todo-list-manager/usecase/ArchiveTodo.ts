import type { TodoId } from "../domain/Todo";
import type { Todos } from "../domain/Todos";

export class ArchiveTodo {
  constructor(private todos: Todos) {}

  async execute(todoId: TodoId) {
    await this.todos.remove(todoId);
  }
}
