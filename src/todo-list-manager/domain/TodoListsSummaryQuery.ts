import type { TodoListsSummaryDto } from "shared/client";
import type { TodoListId } from "./TodoList";

export interface TodoListsSummaryQuery {
  ofTodoLists(todoListsIds: TodoListId[]): Promise<TodoListsSummaryDto>;
}
