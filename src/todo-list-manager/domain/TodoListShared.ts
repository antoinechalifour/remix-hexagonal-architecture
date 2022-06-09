import { Event } from "shared/events";

export class TodoListShared extends Event {
  static TYPE = "todoList.shared";

  constructor(
    public readonly todoListId: string,
    public readonly contributorId: string,
    public readonly newContributorId: string,
    publishedAt: Date
  ) {
    super(TodoListShared.TYPE, publishedAt);
  }
}
