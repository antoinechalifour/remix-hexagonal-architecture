import { TodoListId } from "./TodoList";

export class TodoListNotFoundError extends Error {
  constructor(todoListId: TodoListId) {
    super(`TodoList ${todoListId} was not found`);
  }

  static is(err: unknown): err is TodoListNotFoundError {
    return err instanceof TodoListNotFoundError;
  }
}
