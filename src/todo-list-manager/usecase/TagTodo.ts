import type { Todos } from "../domain/Todos";
import type { OwnerId } from "../domain/OwnerId";
import { tagTodo, TodoId } from "../domain/Todo";

export class TagTodo {
  constructor(private readonly todos: Todos) {}

  async execute(todoId: TodoId, ownerId: OwnerId, tag: string) {
    const todo = await this.todos.ofId(todoId, ownerId);

    await this.todos.save(tagTodo(todo, tag));
  }
}
