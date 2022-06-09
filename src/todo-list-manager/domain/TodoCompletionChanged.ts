import { Event } from "shared/events";

export class TodoCompletionChanged extends Event {
  static TYPE = "todo.markedAsDone";

  constructor(
    public readonly todoListId: string,
    public readonly contributorId: string,
    public readonly todoId: string,
    public readonly completion: "doing" | "done",
    publishedAt: Date
  ) {
    super(TodoCompletionChanged.TYPE, publishedAt);
  }
}
