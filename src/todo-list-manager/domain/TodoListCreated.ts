import { Event } from "shared/events";

export class TodoListCreated extends Event {
  static TYPE = "todoList.created";

  constructor(
    public readonly todoListId: string,
    public readonly contributorId: string,
    publishedAt: Date
  ) {
    super(TodoListCreated.TYPE, publishedAt);
  }
}
