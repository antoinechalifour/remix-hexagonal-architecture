import { Inject, Injectable } from "@nestjs/common";
import { GenerateUUID, Prisma } from "shared";
import { AddTodo } from "../usecase/AddTodo";
import { ChangeTodoCompletion } from "../usecase/ChangeTodoCompletion";
import { ArchiveTodo } from "../usecase/ArchiveTodo";
import { TodoListPrismaRepository } from "../persistence/TodoListPrismaRepository";
import { TodoPrismaRepository } from "../persistence/TodoPrismaRepository";
import { RealClock } from "../infrastructure/RealClock";
import { PRISMA } from "../keys";

@Injectable()
export class TodoApplicationService {
  constructor(
    private readonly todoLists: TodoListPrismaRepository,
    private readonly todos: TodoPrismaRepository,
    private readonly generateId: GenerateUUID,
    private readonly clock: RealClock,
    @Inject(PRISMA) private readonly prisma: Prisma
  ) {}

  add(todoListId: string, title: string, ownerId: string) {
    return this.prisma.$transaction((prisma) =>
      new AddTodo(
        new TodoPrismaRepository(prisma),
        new TodoListPrismaRepository(prisma),
        this.generateId,
        this.clock
      ).execute(todoListId, title, ownerId)
    );
  }

  archive(todoListId: string, todoId: string, ownerId: string) {
    return this.prisma.$transaction((prisma) =>
      new ArchiveTodo(
        new TodoListPrismaRepository(prisma),
        new TodoPrismaRepository(prisma)
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
        new TodoListPrismaRepository(prisma),
        new TodoPrismaRepository(prisma)
      ).execute(todoListId, todoId, isChecked, ownerId)
    );
  }
}
