import { Todos } from "../domain/Todos";
import { renameTodo, TodoId } from "../domain/Todo";
import { OwnerId } from "../domain/OwnerId";

export class RenameTodo {
  constructor(private readonly todos: Todos) {}

  async execute(todoId: TodoId, title: string, ownerId: OwnerId) {
    const todo = await this.todos.ofId(todoId, ownerId);
    await this.todos.save(renameTodo(todo, title));
  }
}
