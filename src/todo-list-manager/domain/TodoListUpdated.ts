import { Event } from "shared/events";

export class TodoListUpdated extends Event {
  static TYPE = "todoList.updated";

  constructor(
    public readonly todoListId: string,
    public readonly contributorId: string
  ) {
    super(TodoListUpdated.TYPE);
  }
}
