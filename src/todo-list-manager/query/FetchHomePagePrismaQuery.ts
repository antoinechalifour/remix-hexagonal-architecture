import type { PrismaClient } from "@prisma/client";
import { Inject, Injectable } from "@nestjs/common";
import type { HomePageDto } from "shared";
import { PRISMA } from "../keys";
import type { FetchHomePageQuery } from "./FetchHomePageQuery";

@Injectable()
export class FetchHomePagePrismaQuery implements FetchHomePageQuery {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  async run(): Promise<HomePageDto> {
    const [totalNumberOfDoingTodos, todoLists] = await Promise.all([
      this.fetchTotalNumberOfDoingTodos(),
      this.fetchTodoLists(),
    ]);

    return {
      totalNumberOfDoingTodos,
      todoLists,
    };
  }

  private fetchTodoLists() {
    return this.prisma.$queryRaw<any[]>`
      SELECT TL.id, TL.title, TL.createdAt, count(T.id) as numberOfTodos
      FROM TodoList TL
      LEFT JOIN Todo T ON TL.id = T.todoListId
      AND T.isComplete IS false
      GROUP BY TL.id;
    `;
  }

  private fetchTotalNumberOfDoingTodos() {
    return this.prisma.$queryRaw<any[]>`
      SELECT count(*) as totalNumberOfDoingTodos
      FROM Todo
      WHERE isComplete IS false;
    `.then((rows) => rows[0].totalNumberOfDoingTodos);
  }
}
