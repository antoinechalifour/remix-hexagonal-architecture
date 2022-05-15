import { TodoLists } from "../domain/TodoLists";
import { renameTodoList, TodoListId } from "../domain/TodoList";
import { OwnerId } from "../domain/OwnerId";

export class RenameTodoList {
  constructor(private readonly todoLists: TodoLists) {}

  async execute(todoListId: TodoListId, title: string, ownerId: OwnerId) {
    const todoList = await this.todoLists.ofId(todoListId, ownerId);

    await this.todoLists.save(renameTodoList(todoList, title));
  }
}
