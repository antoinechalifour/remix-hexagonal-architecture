import { Injectable } from "@nestjs/common";
import { GenerateUUID } from "shared";
import { AddTodoList } from "../usecase/AddTodoList";
import { ArchiveTodoList } from "../usecase/ArchiveTodoList";
import { TodoListDatabaseRepository } from "../infrastructure/TodoListDatabaseRepository";
import { RealClock } from "../../shared/RealClock";
import { ReorderTodos } from "../usecase/ReorderTodos";
import { RenameTodoList } from "../usecase/RenameTodoList";

@Injectable()
export class TodoListApplicationService {
  constructor(
    private readonly todoLists: TodoListDatabaseRepository,
    private readonly generateId: GenerateUUID,
    private readonly clock: RealClock
  ) {}

  add(title: string, ownerId: string) {
    return new AddTodoList(this.todoLists, this.generateId, this.clock).execute(
      title,
      ownerId
    );
  }

  archive(todoListId: string, ownerId: string) {
    return new ArchiveTodoList(this.todoLists).execute(todoListId, ownerId);
  }

  rename(todoListId: string, todoListTitle: string, ownerId: string) {
    return new RenameTodoList(this.todoLists).execute(
      todoListId,
      todoListTitle,
      ownerId
    );
  }

  async reorder(
    todoListId: string,
    ownerId: string,
    todoId: string,
    newIndex: number
  ) {
    return new ReorderTodos(this.todoLists).execute(
      todoListId,
      ownerId,
      todoId,
      newIndex
    );
  }
}
