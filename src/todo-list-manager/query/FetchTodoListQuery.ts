import type { TodoListDto } from "shared";
import type { TodoListId } from "../domain/TodoList";

export interface FetchTodoListQuery {
  run(todoListId: TodoListId): Promise<TodoListDto>;
}
