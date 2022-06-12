import { TodoListEvent } from "./TodoListEvent";

export class TodoReordered extends TodoListEvent {
  static TYPE = "todo.reordered";

  constructor(
    todoListId: string,
    contributorId: string,
    public readonly todoId: string,
    public readonly previousOrder: number,
    public readonly newOrder: number,
    publishedAt: Date
  ) {
    super(TodoReordered.TYPE, todoListId, contributorId, publishedAt);
  }
}
