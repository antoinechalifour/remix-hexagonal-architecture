import type { TodoListId } from "../domain/TodoList";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import type { Collaborators } from "../domain/Collaborators";
import type { CollaboratorId } from "../domain/CollaboratorId";
import {
  canShareTodoList,
  isCollaborator,
  shareWithCollaborator,
} from "../domain/TodoListPermission";

export class ShareTodoList {
  constructor(
    private readonly todoListPermissions: TodoListPermissions,
    private readonly collaborators: Collaborators
  ) {}

  async execute(
    todoListId: TodoListId,
    collaboratorId: CollaboratorId,
    newCollaboratorEmail: string
  ) {
    const permission = await this.todoListPermissions.ofTodoList(todoListId);
    canShareTodoList(permission, collaboratorId);

    const collaboratorToShareWith = await this.collaborators.ofEmail(
      newCollaboratorEmail
    );

    if (!isCollaborator(permission, collaboratorToShareWith.id)) {
      await this.todoListPermissions.save(
        shareWithCollaborator(permission, collaboratorToShareWith.id)
      );
    }
  }
}
