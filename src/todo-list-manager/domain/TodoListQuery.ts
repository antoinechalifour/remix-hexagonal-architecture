import type { TodoListDetailsDto } from "shared/client";
import type { TodoListId } from "./TodoList";
import { TodoListsSummaryDto } from "shared/client";

export interface TodoListQuery {
  detailsOfTodoList(todoListId: TodoListId): Promise<TodoListDetailsDto>;
  summaryOfTodoLists(todoListsIds: TodoListId[]): Promise<TodoListsSummaryDto>;
}
