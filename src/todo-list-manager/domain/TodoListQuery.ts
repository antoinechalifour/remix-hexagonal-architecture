import type { TodoListDetailsDto, TodoListSummaryDto } from "shared/client";
import type { TodoListId } from "./TodoList";

export interface TodoListQuery {
  detailsOfTodoList(todoListId: TodoListId): Promise<TodoListDetailsDto>;
  summaryOfTodoLists(todoListsIds: TodoListId[]): Promise<TodoListSummaryDto[]>;
}
