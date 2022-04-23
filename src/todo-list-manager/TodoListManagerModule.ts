import { Module } from "@nestjs/common";
import { InfrastructureModule } from "infrastructure";
import { TodoApplicationService } from "./application/TodoApplicationService";
import { TodoListApplicationService } from "./application/TodoListApplicationService";
import { FetchHomePagePrismaQuery } from "./query/FetchHomePagePrismaQuery";
import { FetchTodoListPrismaQuery } from "./query/FetchTodoListPrismaQuery";
import { TodoListPrismaRepository } from "./persistence/TodoListPrismaRepository";
import { TodoPrismaRepository } from "./persistence/TodoPrismaRepository";

@Module({
  imports: [InfrastructureModule],
  providers: [
    TodoApplicationService,
    TodoPrismaRepository,
    TodoListApplicationService,
    TodoListPrismaRepository,
    FetchHomePagePrismaQuery,
    FetchTodoListPrismaQuery,
  ],
  exports: [
    TodoApplicationService,
    TodoListApplicationService,
    FetchHomePagePrismaQuery,
    FetchTodoListPrismaQuery,
  ],
})
export class TodoListManagerModule {}
