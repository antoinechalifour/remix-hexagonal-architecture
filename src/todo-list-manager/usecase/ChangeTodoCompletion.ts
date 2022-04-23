import type { Todos } from "../domain/Todos";
import type { TodoId } from "../domain/Todo";

import { updateCompletion } from "../domain/Todo";

export class ChangeTodoCompletion {
  constructor(private readonly todos: Todos) {}

  async execute(todoId: TodoId, isChecked: string) {
    const todo = updateCompletion(
      await this.todos.ofId(todoId),
      isChecked === "on"
    );

    await this.todos.save(todo);
  }
}
