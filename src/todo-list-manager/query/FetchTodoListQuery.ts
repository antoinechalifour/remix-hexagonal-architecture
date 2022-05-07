import type { TodoListDto } from "shared";
import type { TodoListId } from "../domain/TodoList";
import type { OwnerId } from "../domain/OwnerId";

export interface FetchTodoListQuery {
  run(todoListId: TodoListId, ownerId: OwnerId): Promise<TodoListDto>;
}
