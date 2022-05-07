import type { Todos } from "../domain/Todos";
import type { TodoId } from "../domain/Todo";
import type { OwnerId } from "../domain/OwnerId";

import { updateCompletion } from "../domain/Todo";

export class ChangeTodoCompletion {
  constructor(private readonly todos: Todos) {}

  async execute(todoId: TodoId, isChecked: string, ownerId: OwnerId) {
    const todo = updateCompletion(
      await this.todos.ofId(todoId, ownerId),
      isChecked === "on"
    );

    await this.todos.save(todo);
  }
}
