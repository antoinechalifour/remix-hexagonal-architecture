import { TodoListEvent } from "./TodoListEvent";

export class TagAddedToTodo extends TodoListEvent {
  static TYPE = "todo.tagAdded";

  constructor(
    todoListId: string,
    contributorId: string,
    public readonly todoId: string,
    public readonly tag: string,
    publishedAt: Date
  ) {
    super(TagAddedToTodo.TYPE, todoListId, contributorId, publishedAt);
  }
}
