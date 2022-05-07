import { Module } from "@nestjs/common";
import { GenerateUUID, Prisma } from "shared";
import { TodoApplicationService } from "./application/TodoApplicationService";
import { TodoListApplicationService } from "./application/TodoListApplicationService";
import { FetchHomePagePrismaQuery } from "./query/FetchHomePagePrismaQuery";
import { FetchTodoListPrismaQuery } from "./query/FetchTodoListPrismaQuery";
import { TodoListPrismaRepository } from "./persistence/TodoListPrismaRepository";
import { TodoPrismaRepository } from "./persistence/TodoPrismaRepository";
import { PRISMA } from "./keys";
import { RealClock } from "./infrastructure/RealClock";

@Module({
  providers: [
    TodoApplicationService,
    TodoPrismaRepository,
    TodoListApplicationService,
    TodoListPrismaRepository,
    FetchHomePagePrismaQuery,
    FetchTodoListPrismaQuery,
    GenerateUUID,
    RealClock,
    {
      provide: PRISMA,
      useClass: Prisma,
    },
  ],
  exports: [
    PRISMA,
    TodoApplicationService,
    TodoListApplicationService,
    FetchHomePagePrismaQuery,
    FetchTodoListPrismaQuery,
  ],
})
export class TodoListManagerModule {}
