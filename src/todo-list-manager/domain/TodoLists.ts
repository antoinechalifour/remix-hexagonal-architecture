import type { TodoList, TodoListId } from "./TodoList";

export interface TodoLists {
  ofId(todoListId: TodoListId): Promise<TodoList>;
  save(todoList: TodoList): Promise<void>;
  remove(todoListId: TodoListId): Promise<void>;
}
