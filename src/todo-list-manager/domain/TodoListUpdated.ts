import { TodoListEvent } from "./TodoListEvent";

export type Changes = Record<string, { previous: string; current: string }>;

export class TodoListUpdated extends TodoListEvent {
  static TYPE = "todoList.updated";

  constructor(
    todoListId: string,
    contributorId: string,
    public readonly changes: Changes,
    publishedAt: Date
  ) {
    super(TodoListUpdated.TYPE, todoListId, contributorId, publishedAt);
  }
}
