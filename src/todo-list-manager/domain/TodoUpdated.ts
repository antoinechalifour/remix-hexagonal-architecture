import { Event } from "shared/events";

export type Changes = Record<string, { previous: string; current: string }>;

export class TodoUpdated extends Event {
  static TYPE = "todo.updated";

  constructor(
    public readonly todoListId: string,
    public readonly contributorId: string,
    public readonly todoId: string,
    public readonly changes: Changes,
    publishedAt: Date
  ) {
    super(TodoUpdated.TYPE, publishedAt);
  }
}
