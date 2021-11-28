import type { TodoListId } from "~/domain/TodoList";
import type { TodoListReadModel } from "~/query/TodoListReadModel";

export interface FetchTodoListQuery {
  run(todoListId: TodoListId): Promise<TodoListReadModel>;
}
