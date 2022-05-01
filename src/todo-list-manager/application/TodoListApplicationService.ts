import { Injectable } from "@nestjs/common";
import { AddTodoList } from "../usecase/AddTodoList";
import { ArchiveTodoList } from "../usecase/ArchiveTodoList";
import { TodoListId } from "../domain/TodoList";
import { TodoListPrismaRepository } from "../persistence/TodoListPrismaRepository";
import { GenerateUUID } from "../infrastructure/GenerateUUID";
import { RealClock } from "../infrastructure/RealClock";

@Injectable()
export class TodoListApplicationService {
  constructor(
    private readonly todoLists: TodoListPrismaRepository,
    private readonly generateId: GenerateUUID,
    private readonly clock: RealClock
  ) {}

  add(title: string) {
    return new AddTodoList(this.todoLists, this.generateId, this.clock).execute(
      title
    );
  }

  archive(todoListId: string) {
    return new ArchiveTodoList(this.todoLists).execute(
      todoListId as TodoListId
    );
  }
}
