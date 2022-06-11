import { TodoListEvent } from "./TodoListEvent";

export class TagRemovedFromTodo extends TodoListEvent {
  static TYPE = "todo.tagRemoved";

  constructor(
    todoListId: string,
    contributorId: string,
    public readonly todoId: string,
    public readonly tag: string,
    publishedAt: Date
  ) {
    super(TagRemovedFromTodo.TYPE, todoListId, contributorId, publishedAt);
  }
}
