import { TodoListPermissions } from "../domain/TodoListPermissions";
import { TodoListId } from "../domain/TodoList";
import { CollaboratorId } from "../domain/CollaboratorId";
import {
  canShareTodoList,
  unshareWithCollaborator,
} from "../domain/TodoListPermission";

export class UnshareTodoList {
  constructor(private readonly todoListPermissions: TodoListPermissions) {}

  async execute(
    todoListId: TodoListId,
    ownerId: CollaboratorId,
    collaboratorForUnsharing: CollaboratorId
  ) {
    const permissions = await this.todoListPermissions.ofTodoList(todoListId);
    canShareTodoList(permissions, ownerId);

    await this.todoListPermissions.save(
      unshareWithCollaborator(permissions, collaboratorForUnsharing)
    );
  }
}
