import type { PrismaClient } from "@prisma/client";
import { Inject, Injectable } from "@nestjs/common";
import type { HomePageDto } from "shared";
import { PRISMA } from "../../keys";
import type { FetchHomePage } from "../domain/FetchHomePage";
import type { OwnerId } from "../domain/OwnerId";

@Injectable()
export class FetchHomePageDatabaseQuery implements FetchHomePage {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  async run(ownerId: OwnerId): Promise<HomePageDto> {
    const [totalNumberOfDoingTodos, todoLists] = await Promise.all([
      this.fetchTotalNumberOfDoingTodos(ownerId),
      this.fetchTodoLists(ownerId),
    ]);

    return {
      totalNumberOfDoingTodos,
      todoLists,
    };
  }

  private fetchTodoLists(ownerId: OwnerId) {
    return this.prisma.$queryRaw<any[]>`
      SELECT TL.id, TL.title, TL."createdAt", count(T.id) as "numberOfTodos"
      FROM "TodoList" TL
      LEFT JOIN "Todo" T ON TL.id = T."todoListId" AND T."ownerId" = TL."ownerId"
      AND T."isComplete" IS false
      WHERE TL."ownerId" = ${ownerId}
      GROUP BY TL.id;
    `;
  }

  private fetchTotalNumberOfDoingTodos(ownerId: OwnerId) {
    return this.prisma.$queryRaw<{ totalNumberOfDoingTodos: number }[]>`
      SELECT count(*) as "totalNumberOfDoingTodos"
      FROM "Todo"
      WHERE "isComplete" IS false AND "ownerId" = ${ownerId};
    `.then((rows) => rows[0].totalNumberOfDoingTodos);
  }
}
