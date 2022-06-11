import { TodoListEvent } from "./TodoListEvent";

export class TodoCompletionChanged extends TodoListEvent {
  static TYPE = "todo.completionChanged";

  constructor(
    todoListId: string,
    contributorId: string,
    public readonly todoId: string,
    public readonly completion: "doing" | "done",
    publishedAt: Date
  ) {
    super(TodoCompletionChanged.TYPE, todoListId, contributorId, publishedAt);
  }
}
