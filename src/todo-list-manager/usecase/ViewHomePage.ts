import type { HomePageDto, TodoListSummaryDto } from "shared/client";
import type { ContributorId } from "../domain/ContributorId";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import type { TodoListQuery } from "../domain/TodoListQuery";
import partition from "lodash.partition";
import {
  getTodoListId,
  TodoListPermission,
} from "../domain/TodoListPermission";

export class ViewHomePage {
  constructor(
    private readonly todoListPermissions: TodoListPermissions,
    private readonly todoListQuery: TodoListQuery
  ) {}

  async execute(contributorId: ContributorId): Promise<HomePageDto> {
    const [permissionsOwner, permissionsContributor] = partition(
      await this.todoListPermissions.ofContributor(contributorId),
      (permission) => permission.ownerId === contributorId
    );

    const [todoListsOwned, todoListsContributed] = await Promise.all([
      this.todoListOfPermission(permissionsOwner),
      this.todoListOfPermission(permissionsContributor),
    ]);

    return {
      todoListsOwned: todoListsOwned.map((todoList) => ({
        ...todoList,
        permissions: { archive: true, leave: false },
      })),
      todoListsContributed: todoListsContributed.map((todoList) => ({
        ...todoList,
        permissions: { archive: false, leave: true },
      })),
      totalNumberOfDoingTodos: this.totalNumberOfDoingTodos([
        ...todoListsOwned,
        ...todoListsContributed,
      ]),
    };
  }

  private totalNumberOfDoingTodos(todoListsSummaries: TodoListSummaryDto[]) {
    return todoListsSummaries.reduce(
      (count, summary) => count + summary.numberOfTodos,
      0
    );
  }

  private todoListOfPermission(permissions: TodoListPermission[]) {
    return this.todoListQuery.summaryOfTodoLists(
      permissions.map(getTodoListId)
    );
  }
}
