import { Event } from "shared/events";

export class TagAddedToTodo extends Event {
  static TYPE = "todo.tag.added";

  constructor(
    public readonly todoListId: string,
    public readonly contributorId: string,
    public readonly todoId: string,
    public readonly tag: string
  ) {
    super(TagAddedToTodo.TYPE);
  }
}
