import type { TodoListId } from "./TodoList";
import type { CollaboratorId } from "./CollaboratorId";

export class TodoListPermissionDeniedError extends Error {
  constructor(todoListId: TodoListId, collaboratorId: CollaboratorId) {
    super(
      `Access to TodoList ${todoListId} denied for collaborator ${collaboratorId}`
    );
  }
}
