import { Event } from "../../shared/Events";

export class TodoListUpdated extends Event {
  static TYPE = "todoList.updated";

  constructor(
    public readonly todoListId: string,
    public readonly ownerId: string,
    public readonly sessionId: string
  ) {
    super(TodoListUpdated.TYPE);
  }
}
