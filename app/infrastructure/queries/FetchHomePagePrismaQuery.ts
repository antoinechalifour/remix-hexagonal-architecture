import type { PrismaClient } from "@prisma/client";
import type { FetchHomePageQuery } from "~/query/FetchHomePageQuery";
import type { HomePageReadModel } from "~/query/HomePageReadModel";

interface FetchHomePagePrismaQueryOptions {
  prisma: PrismaClient;
}

export class FetchHomePagePrismaQuery implements FetchHomePageQuery {
  private readonly prisma;

  constructor({ prisma }: FetchHomePagePrismaQueryOptions) {
    this.prisma = prisma;
  }

  async run(): Promise<HomePageReadModel> {
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
