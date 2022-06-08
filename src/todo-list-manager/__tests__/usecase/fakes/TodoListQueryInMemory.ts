import type { TodoListDetailsDto, TodoListSummaryDto } from "shared/client";
import type { TodoListQuery } from "../../../domain/TodoListQuery";
import type { TodoListId } from "../../../domain/TodoList";

export class TodoListQueryInMemory implements TodoListQuery {
  private todoListDetailsDatabase = new Map<string, TodoListDetailsDto>();
  private todoListSummariesDatabase = new Map<string, TodoListSummaryDto>();

  withTodoListDetails(...todoListDetails: TodoListDetailsDto[]) {
    for (let todoListDetail of todoListDetails) {
      this.todoListDetailsDatabase.set(todoListDetail.id, todoListDetail);
    }
  }

  withTodoListSummary(...todoListSummaries: TodoListSummaryDto[]) {
    for (let todoListSummary of todoListSummaries) {
      this.todoListSummariesDatabase.set(todoListSummary.id, todoListSummary);
    }
  }

  async detailsOfTodoList(todoListId: TodoListId): Promise<TodoListDetailsDto> {
    const todoListDetailsDto = this.todoListDetailsDatabase.get(todoListId);

    if (todoListDetailsDto == null)
      throw new Error(`Todo list ${todoListId} was not found`);

    return todoListDetailsDto;
  }

  async summaryOfTodoLists(
    todoListsIds: TodoListId[]
  ): Promise<TodoListSummaryDto[]> {
    return todoListsIds
      .map((todoListId) => this.todoListSummariesDatabase.get(todoListId))
      .filter((item): item is TodoListSummaryDto => item != null);
  }
}
