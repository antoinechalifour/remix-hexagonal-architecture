import { TodoListEvent } from "./TodoListEvent";

export class TodoAdded extends TodoListEvent {
  static TYPE = "todo.added";

  constructor(
    todoListId: string,
    contributorId: string,
    public readonly todoId: string,
    publishedAt: Date
  ) {
    super(TodoAdded.TYPE, todoListId, contributorId, publishedAt);
  }
}
