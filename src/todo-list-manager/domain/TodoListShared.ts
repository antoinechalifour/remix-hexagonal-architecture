import type { TodoListId } from "./TodoList";
import type { CollaboratorId } from "./CollaboratorId";
import { Event } from "shared/events";

export class TodoListShared extends Event {
  static type = "todoList.shared";

  constructor(
    public readonly todoListId: TodoListId,
    public readonly collaboratorId: CollaboratorId
  ) {
    super(TodoListShared.type);
  }
}
