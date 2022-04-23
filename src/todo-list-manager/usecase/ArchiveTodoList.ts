import type { TodoLists } from "../domain/TodoLists";
import type { TodoListId } from "../domain/TodoList";

export class ArchiveTodoList {
  constructor(private readonly todoLists: TodoLists) {}

  async execute(todoListId: TodoListId) {
    await this.todoLists.remove(todoListId);
  }
}
