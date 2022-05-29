import type { TodoListId } from "../domain/TodoList";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import type { Collaborators } from "../domain/Collaborators";
import type { CollaboratorId } from "../domain/CollaboratorId";
import {
  canShareTodoList,
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

    const collaborator = await this.collaborators.ofEmail(newCollaboratorEmail);
    await this.todoListPermissions.save(
      shareWithCollaborator(permission, collaborator.id)
    );
  }
}
