import { TodoListEvent } from "./TodoListEvent";

export class TodoDeleted extends TodoListEvent {
  static TYPE = "todo.deleted";

  constructor(
    todoListId: string,
    contributorId: string,
    public readonly todoId: string,
    public readonly todoTitle: string,
    publishedAt: Date
  ) {
    super(TodoDeleted.TYPE, todoListId, contributorId, publishedAt);
  }
}
