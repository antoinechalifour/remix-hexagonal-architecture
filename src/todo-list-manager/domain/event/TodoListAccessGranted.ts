import { TodoListEvent } from "./TodoListEvent";

export class TodoListAccessGranted extends TodoListEvent {
  static TYPE = "todoList.accessGranted";

  constructor(
    todoListId: string,
    contributorId: string,
    public readonly newContributorId: string,
    publishedAt: Date
  ) {
    super(TodoListAccessGranted.TYPE, todoListId, contributorId, publishedAt);
  }
}
