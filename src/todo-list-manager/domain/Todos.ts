import type { TodoListId } from "./TodoList";
import type { Todo, TodoId } from "./Todo";
import type { OwnerId } from "./OwnerId";

export interface Todos {
  ofId(todoId: TodoId, ownerId: OwnerId): Promise<Todo>;
  ofTodoList(todoListId: TodoListId, ownerId: OwnerId): Promise<Todo[]>;
  save(todo: Todo): Promise<void>;
  remove(todoId: string, ownerId: OwnerId): Promise<void>;
}
