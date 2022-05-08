import type { TodoLists } from "../domain/TodoLists";
import type { TodoListId } from "../domain/TodoList";
import type { OwnerId } from "../domain/OwnerId";
import type { TodoId } from "../domain/Todo";
import { reorderTodoList } from "../domain/TodoList";

export class ReorderTodos {
  constructor(private readonly todoLists: TodoLists) {}

  async execute(
    todoListId: TodoListId,
    ownerId: OwnerId,
    todoToReorderId: TodoId,
    newIndex: number
  ) {
    const todoList = await this.todoLists.ofId(todoListId, ownerId);

    await this.todoLists.save(
      reorderTodoList(todoList, todoToReorderId, newIndex)
    );
  }
}
