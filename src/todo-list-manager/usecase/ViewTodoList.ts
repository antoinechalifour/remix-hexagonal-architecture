import type { TodoListId } from "../domain/TodoList";
import type { ContributorId } from "../domain/ContributorId";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import type { TodoListQuery } from "../domain/TodoListQuery";
import type { Contributors } from "../domain/Contributors";
import type {
  TodoListContributorDto,
  TodoListDetailsDto,
  TodoListPageDto,
} from "shared/client";
import {
  canView,
  getRole,
  isOwner,
  TodoListPermission,
} from "../domain/TodoListPermission";
import { Contributor } from "../domain/Contributor";

export class ViewTodoList {
  constructor(
    private readonly todoListPermissions: TodoListPermissions,
    private readonly contributors: Contributors,
    private readonly todoListQuery: TodoListQuery
  ) {}

  async execute(
    todoListId: TodoListId,
    contributorId: ContributorId
  ): Promise<TodoListPageDto> {
    const permissions = await this.todoListPermissions.ofTodoList(todoListId);
    canView(permissions, contributorId);

    const [contributors, todoListDetails] = await Promise.all([
      this.contributors.ofIds([
        permissions.ownerId,
        ...permissions.contributorsIds,
      ]),
      this.todoListQuery.detailsOfTodoList(todoListId),
    ]);

    return {
      isOwner: isOwner(permissions, contributorId),
      todoList: todoListDetails,
      completion: this.computeCompletion(todoListDetails),
      contributors: contributors.map((contributor) =>
        toTodoListContributorDto(contributor, permissions)
      ),
    };
  }

  private computeCompletion(todoListDetails: TodoListDetailsDto) {
    const totalNumberOfTodos =
      todoListDetails.doingTodos.length + todoListDetails.doneTodos.length;

    if (totalNumberOfTodos === 0) return 0;
    let percentage =
      (todoListDetails.doneTodos.length / totalNumberOfTodos) * 100;

    return Math.round(percentage);
  }
}

function toTodoListContributorDto(
  contributor: Contributor,
  permission: TodoListPermission
): TodoListContributorDto {
  const [beforeAtSign] = contributor.email.split("@");
  const parts = beforeAtSign.split(".").slice(0, 2);
  const shortName = parts.map((parts) => parts.charAt(0)).join("");

  return {
    id: contributor.id,
    email: contributor.email,
    shortName,
    role: getRole(contributor, permission),
  };
}
