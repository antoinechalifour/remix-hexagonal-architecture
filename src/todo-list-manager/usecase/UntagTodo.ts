import type { Todos } from "../domain/Todos";
import type { OwnerId } from "../domain/OwnerId";

import { TodoId, untagTodo } from "../domain/Todo";

export class UntagTodo {
  constructor(private readonly todos: Todos) {}

  async execute(todoId: TodoId, ownerId: OwnerId, tag: string) {
    const todo = await this.todos.ofId(todoId, ownerId);

    await this.todos.save(untagTodo(todo, tag));
  }
}
