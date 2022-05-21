import { Injectable } from "@nestjs/common";
import { RealClock } from "shared/time";
import { GenerateUUID } from "shared";
import { AddTodoList } from "../usecase/AddTodoList";
import { ArchiveTodoList } from "../usecase/ArchiveTodoList";
import { TodoListDatabaseRepository } from "../infrastructure/TodoListDatabaseRepository";
import { NestEvents } from "../../shared/NestEvents";
import { ReorderTodos } from "../usecase/ReorderTodos";
import { RenameTodoList } from "../usecase/RenameTodoList";
import { TodoListUpdated } from "../domain/TodoListUpdated";
import { CurrentUser } from "authentication";

@Injectable()
export class TodoListApplicationService {
  constructor(
    private readonly todoLists: TodoListDatabaseRepository,
    private readonly generateId: GenerateUUID,
    private readonly clock: RealClock,
    private readonly events: NestEvents
  ) {}

  add(title: string, currentUser: CurrentUser) {
    return new AddTodoList(this.todoLists, this.generateId, this.clock).execute(
      title,
      currentUser.id
    );
  }

  archive(todoListId: string, currentUser: CurrentUser) {
    return new ArchiveTodoList(this.todoLists).execute(
      todoListId,
      currentUser.id
    );
  }

  async rename(
    todoListId: string,
    todoListTitle: string,
    currentUser: CurrentUser
  ) {
    await new RenameTodoList(this.todoLists).execute(
      todoListId,
      todoListTitle,
      currentUser.id
    );

    this.events.publish(
      new TodoListUpdated(todoListId, currentUser.id, currentUser.sessionId)
    );
  }

  async reorder(
    todoListId: string,
    currentUser: CurrentUser,
    todoId: string,
    newIndex: number
  ) {
    await new ReorderTodos(this.todoLists).execute(
      todoListId,
      currentUser.id,
      todoId,
      newIndex
    );

    this.events.publish(
      new TodoListUpdated(todoListId, currentUser.id, currentUser.sessionId)
    );
  }
}
