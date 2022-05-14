import type { TodoListDto } from "shared";
import type { TodoListId } from "./TodoList";
import type { OwnerId } from "./OwnerId";

export interface FetchTodoList {
  run(todoListId: TodoListId, ownerId: OwnerId): Promise<TodoListDto>;
}
