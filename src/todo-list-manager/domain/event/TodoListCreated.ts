import { TodoListEvent } from "./TodoListEvent";

export class TodoListCreated extends TodoListEvent {
  static TYPE = "todoList.created";

  constructor(todoListId: string, contributorId: string, publishedAt: Date) {
    super(TodoListCreated.TYPE, todoListId, contributorId, publishedAt);
  }
}
