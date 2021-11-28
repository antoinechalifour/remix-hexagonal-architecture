import type { Todos } from "./Todos";
import type { TodoId } from "./Todo";

import { updateCompletion } from "./Todo";

interface ChangeTodoCompletionOptions {
  todos: Todos;
}

export class ChangeTodoCompletion {
  private readonly todos;

  constructor({ todos }: ChangeTodoCompletionOptions) {
    this.todos = todos;
  }

  async execute(todoId: TodoId, isChecked: string) {
    const todo = updateCompletion(
      await this.todos.ofId(todoId),
      isChecked === "on"
    );

    await this.todos.save(todo);
  }
}
