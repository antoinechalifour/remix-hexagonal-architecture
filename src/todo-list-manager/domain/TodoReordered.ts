import { Event } from "shared/events";

export class TodoReordered extends Event {
  static TYPE = "todo.reordered";

  constructor(
    public readonly todoListId: string,
    public readonly contributorId: string,
    public readonly todoId: string,
    public readonly previousOrder: number,
    public readonly newOrder: number,
    publishedAt: Date
  ) {
    super(TodoReordered.TYPE, publishedAt);
  }
}
