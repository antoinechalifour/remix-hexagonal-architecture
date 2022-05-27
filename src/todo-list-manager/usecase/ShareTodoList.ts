import { TodoListId } from "../domain/TodoList";
import { OwnerId } from "../domain/OwnerId";
import { TodoListPermissions } from "../domain/TodoListPermissions";
import {
  canShareTodoList,
  shareWithCollaborator,
} from "../domain/TodoListPermission";
import { Collaborators } from "../domain/Collaborators";

export class ShareTodoList {
  constructor(
    private readonly todoListPermissions: TodoListPermissions,
    private readonly collaborators: Collaborators
  ) {}

  async execute(
    todoListId: TodoListId,
    ownerId: OwnerId,
    newCollaboratorEmail: string
  ) {
    const permission = await this.todoListPermissions.ofTodoList(todoListId);
    canShareTodoList(permission, ownerId);

    const collaborator = await this.collaborators.ofEmail(newCollaboratorEmail);
    await this.todoListPermissions.save(
      shareWithCollaborator(permission, collaborator.id)
    );
  }
}
