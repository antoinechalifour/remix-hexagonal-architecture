import type { TodoListId } from "./TodoList";
import type { CollaboratorId } from "./CollaboratorId";

export class TodoListPermissionDenied extends Error {
  constructor(todoListId: TodoListId, collaboratorId: CollaboratorId) {
    super(
      `Access to TodoList ${todoListId} denied for collaborator ${collaboratorId}`
    );
  }
}
