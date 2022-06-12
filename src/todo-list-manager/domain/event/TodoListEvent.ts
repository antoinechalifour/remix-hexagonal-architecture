import { Event } from "shared/events";

export abstract class TodoListEvent extends Event {
  protected constructor(
    type: string,
    public readonly todoListId: string,
    public readonly contributorId: string,
    publishedAt: Date
  ) {
    super(type, publishedAt);
  }
}
