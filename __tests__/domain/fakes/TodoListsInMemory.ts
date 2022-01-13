import type { TodoLists } from "~/domain/TodoLists";
import type { TodoList, TodoListId } from "~/domain/TodoList";

export class TodoListsInMemory implements TodoLists {
  private __database = new Map<string, TodoList>();

  all(): Promise<TodoList[]> {
    return Promise.resolve([...this.__database.values()]);
  }

  ofId(todoListId: TodoListId): Promise<TodoList> {
    const todoList = this.__database.get(todoListId);
    if (todoList) return Promise.resolve(todoList);

    throw new Error(`Todolist ${todoListId} not found`);
  }

  remove(todoListId: string): Promise<void> {
    this.__database.delete(todoListId);

    return Promise.resolve();
  }

  save(todoList: TodoList): Promise<void> {
    this.__database.set(todoList.id, todoList);

    return Promise.resolve();
  }
}
