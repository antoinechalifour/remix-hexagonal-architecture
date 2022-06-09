import { Event } from "shared/events";

export class TagRemovedFromTodo extends Event {
  static TYPE = "todo.tagRemoved";

  constructor(
    public readonly todoListId: string,
    public readonly contributorId: string,
    public readonly todoId: string,
    public readonly tag: string,
    publishedAt: Date
  ) {
    super(TagRemovedFromTodo.TYPE, publishedAt);
  }
}
