import { Event } from "shared/events";

export class TodoListEvent extends Event {
  constructor(
    type: string,
    public readonly todoListId: string,
    public readonly contributorId: string,
    publishedAt: Date
  ) {
    super(type, publishedAt);
  }
}
