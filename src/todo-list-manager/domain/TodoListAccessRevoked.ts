import { TodoListEvent } from "./TodoListEvent";

export class TodoListAccessRevoked extends TodoListEvent {
  static TYPE = "todoList.accessRevoked";

  constructor(
    todoListId: string,
    contributorId: string,
    public readonly previousContributorId: string,
    publishedAt: Date
  ) {
    super(TodoListAccessRevoked.TYPE, todoListId, contributorId, publishedAt);
  }
}
