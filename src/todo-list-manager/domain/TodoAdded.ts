import { Event } from "shared/events";

export class TodoAdded extends Event {
  static TYPE = "todo.added";

  constructor(
    public readonly todoListId: string,
    public readonly contributorId: string,
    public readonly todoId: string
  ) {
    super(TodoAdded.TYPE);
  }
}
