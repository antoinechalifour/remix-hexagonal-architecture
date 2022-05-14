import { Inject, Injectable } from "@nestjs/common";
import { GenerateUUID, Prisma } from "shared";
import { AddTodo } from "../usecase/AddTodo";
import { ChangeTodoCompletion } from "../usecase/ChangeTodoCompletion";
import { ArchiveTodo } from "../usecase/ArchiveTodo";
import { TodoListDatabaseRepository } from "../infrastructure/TodoListDatabaseRepository";
import { TodoDatabaseRepository } from "../infrastructure/TodoDatabaseRepository";
import { RealClock } from "../../shared/RealClock";
import { PRISMA } from "../../keys";

@Injectable()
export class TodoApplicationService {
  constructor(
    private readonly todoLists: TodoListDatabaseRepository,
    private readonly todos: TodoDatabaseRepository,
    private readonly generateId: GenerateUUID,
    private readonly clock: RealClock,
    @Inject(PRISMA) private readonly prisma: Prisma
  ) {}

  add(todoListId: string, title: string, ownerId: string) {
    return this.prisma.$transaction((prisma) =>
      new AddTodo(
        new TodoDatabaseRepository(prisma),
        new TodoListDatabaseRepository(prisma),
        this.generateId,
        this.clock
      ).execute(todoListId, title, ownerId)
    );
  }

  archive(todoListId: string, todoId: string, ownerId: string) {
    return this.prisma.$transaction((prisma) =>
      new ArchiveTodo(
        new TodoListDatabaseRepository(prisma),
        new TodoDatabaseRepository(prisma)
      ).execute(todoListId, todoId, ownerId)
    );
  }

  changeTodoCompletion(
    todoListId: string,
    todoId: string,
    isChecked: string,
    ownerId: string
  ) {
    return this.prisma.$transaction((prisma) =>
      new ChangeTodoCompletion(
        new TodoListDatabaseRepository(prisma),
        new TodoDatabaseRepository(prisma)
      ).execute(todoListId, todoId, isChecked, ownerId)
    );
  }
}
