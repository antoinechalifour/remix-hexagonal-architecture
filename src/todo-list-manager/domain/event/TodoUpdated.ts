import { TodoListEvent } from "./TodoListEvent";

export type Changes = Record<string, { previous: string; current: string }>;

export class TodoUpdated extends TodoListEvent {
  static TYPE = "todo.updated";

  constructor(
    todoListId: string,
    contributorId: string,
    public readonly todoId: string,
    public readonly changes: Changes,
    publishedAt: Date
  ) {
    super(TodoUpdated.TYPE, todoListId, contributorId, publishedAt);
  }
}
