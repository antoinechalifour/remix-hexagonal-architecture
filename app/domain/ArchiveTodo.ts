import type { TodoId } from "./Todo";
import type { Todos } from "./Todos";

interface ArchiveTodoOptions {
  todos: Todos;
}

export class ArchiveTodo {
  private readonly todos;

  constructor({ todos }: ArchiveTodoOptions) {
    this.todos = todos;
  }

  async execute(todoId: TodoId) {
    await this.todos.remove(todoId);
  }
}
