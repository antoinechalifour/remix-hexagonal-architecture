import type { TodoId } from "../domain/Todo";
import type { Todos } from "../domain/Todos";
import type { OwnerId } from "../domain/OwnerId";
import type { TodoLists } from "../domain/TodoLists";
import type { TodoListId } from "../domain/TodoList";
import { removeTodo } from "../domain/TodoList";

export class ArchiveTodo {
  constructor(private todoLists: TodoLists, private todos: Todos) {}

  async execute(todoListId: TodoListId, todoId: TodoId, ownerId: OwnerId) {
    const todoList = await this.todoLists.ofId(todoListId, ownerId);

    await Promise.all([
      this.todoLists.save(removeTodo(todoList, todoId)),
      this.todos.remove(todoId, ownerId),
    ]);
  }
}
