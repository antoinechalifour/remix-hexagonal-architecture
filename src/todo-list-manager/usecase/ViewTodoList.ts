import type { TodoListId } from "../domain/TodoList";
import type { CollaboratorId } from "../domain/CollaboratorId";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import type { TodoListQuery } from "../domain/TodoListQuery";
import type { Collaborators } from "../domain/Collaborators";
import type { TodoListPageDto } from "shared/client";
import { canView, isOwner } from "../domain/TodoListPermission";
import { Collaborator } from "../domain/Collaborator";

export class ViewTodoList {
  constructor(
    private readonly todoListPermissions: TodoListPermissions,
    private readonly collaborators: Collaborators,
    private readonly todoListQuery: TodoListQuery
  ) {}

  async execute(
    todoListId: TodoListId,
    collaboratorId: CollaboratorId
  ): Promise<TodoListPageDto> {
    const permissions = await this.todoListPermissions.ofTodoList(todoListId);
    canView(permissions, collaboratorId);

    const [collaborators, todoListDetails] = await Promise.all([
      this.collaborators.ofIds([
        permissions.ownerId,
        ...permissions.collaboratorsIds,
      ]),
      this.todoListQuery.detailsOfTodoList(todoListId),
    ]);

    return {
      isOwner: isOwner(permissions, collaboratorId),
      todoList: todoListDetails,
      collaborators: collaborators.map(toTodoListCollaboratorDto),
    };
  }
}

function toTodoListCollaboratorDto(collaborator: Collaborator) {
  const [beforeAtSign] = collaborator.email.split("@");
  const parts = beforeAtSign.split(".").slice(0, 2);
  const shortName = parts.map((parts) => parts.charAt(0)).join("");

  return {
    id: collaborator.id,
    email: collaborator.email,
    shortName,
  };
}
