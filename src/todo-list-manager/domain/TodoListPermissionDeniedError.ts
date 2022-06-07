import type { TodoListId } from "./TodoList";
import type { ContributorId } from "./ContributorId";

export class TodoListPermissionDeniedError extends Error {
  constructor(todoListId: TodoListId, contributorId: ContributorId) {
    super(
      `Access to TodoList ${todoListId} denied for contributor ${contributorId}`
    );
  }

  static is(err: unknown): err is TodoListPermissionDeniedError {
    return err instanceof TodoListPermissionDeniedError;
  }
}
