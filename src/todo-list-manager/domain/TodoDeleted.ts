import { Event } from "shared/events";

export class TodoDeleted extends Event {
  static TYPE = "todo.deleted";

  constructor(
    public readonly todoListId: string,
    public readonly type: string,
    public readonly todoId: string,
    public readonly todoTitle: string,
    publishedAt: Date
  ) {
    super(TodoDeleted.TYPE, publishedAt);
  }
}
