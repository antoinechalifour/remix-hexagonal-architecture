import type { TodoLists } from "./TodoLists";
import type { TodoListId } from "./TodoList";

interface ArchiveTodoListOptions {
  todoLists: TodoLists;
}

export class ArchiveTodoList {
  private readonly todoLists;

  constructor({ todoLists }: ArchiveTodoListOptions) {
    this.todoLists = todoLists;
  }

  async execute(todoListId: TodoListId) {
    await this.todoLists.remove(todoListId);
  }
}
