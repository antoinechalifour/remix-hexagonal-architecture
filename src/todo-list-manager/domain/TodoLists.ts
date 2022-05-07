import type { TodoList, TodoListId } from "./TodoList";
import type { OwnerId } from "./OwnerId";

export interface TodoLists {
  all(ownerId: OwnerId): Promise<TodoList[]>;
  ofId(todoListId: TodoListId, ownerId: OwnerId): Promise<TodoList>;
  save(todoList: TodoList): Promise<void>;
  remove(todoListId: TodoListId, ownerId: OwnerId): Promise<void>;
}
