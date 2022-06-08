import type { TodoLists } from "../../../domain/TodoLists";
import type { TodoList, TodoListId } from "../../../domain/TodoList";

export class TodoListsInMemory implements TodoLists {
  private __database = new Map<string, TodoList>();

  async ofId(todoListId: TodoListId): Promise<TodoList> {
    const todoList = this.__database.get(todoListId);
    if (todoList) return Promise.resolve(todoList);

    throw new Error(`Todolist ${todoListId} not found`);
  }

  async remove(todoListId: string): Promise<void> {
    this.__database.delete(todoListId);

    return Promise.resolve();
  }

  async save(todoList: TodoList): Promise<void> {
    this.__database.set(todoList.id, todoList);
  }
}
