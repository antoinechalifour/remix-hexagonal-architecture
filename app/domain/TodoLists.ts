import type { TodoList, TodoListId } from "./TodoList";

export interface TodoLists {
  all(): Promise<TodoList[]>;
  ofId(todoListId: TodoListId): Promise<TodoList>;
  save(todoList: TodoList): Promise<void>;
  remove(todoListId: string): Promise<void>;
}
