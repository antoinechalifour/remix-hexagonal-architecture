import type { TodoListsSummaryDto } from "shared/client";
import type { TodoListsSummaryQuery } from "../domain/TodoListsSummaryQuery";
import type { TodoListId } from "../domain/TodoList";
import { PrismaClient, Prisma } from "@prisma/client";
import { Inject, Injectable } from "@nestjs/common";
import { PRISMA } from "../../keys";

@Injectable()
export class TodoListsSummaryDatabaseQuery implements TodoListsSummaryQuery {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  async ofTodoLists(todoListsIds: TodoListId[]): Promise<TodoListsSummaryDto> {
    if (todoListsIds.length === 0)
      return {
        todoLists: [],
        totalNumberOfDoingTodos: 0,
      };

    const [totalNumberOfDoingTodos, todoLists] = await Promise.all([
      this.fetchTotalNumberOfDoingTodos(todoListsIds),
      this.fetchTodoLists(todoListsIds),
    ]);

    return {
      totalNumberOfDoingTodos,
      todoLists,
    };
  }

  private fetchTodoLists(todoListsIds: TodoListId[]) {
    return this.prisma.$queryRaw<any[]>`
      SELECT TL.id, TL.title, TL."createdAt", count(T.id) as "numberOfTodos"
      FROM "TodoList" TL
      LEFT JOIN "Todo" T ON TL.id = T."todoListId" AND T."isComplete" IS false
      WHERE TL."id" IN (${Prisma.join(todoListsIds)})
      GROUP BY TL.id;
    `;
  }

  private fetchTotalNumberOfDoingTodos(todoListsIds: TodoListId[]) {
    return this.prisma.$queryRaw<{ totalNumberOfDoingTodos: number }[]>`
      SELECT count(*) as "totalNumberOfDoingTodos"
      FROM "Todo" T
      WHERE T."isComplete" IS false AND T."todoListId" IN (${Prisma.join(
        todoListsIds
      )});
    `.then((rows) => rows[0].totalNumberOfDoingTodos);
  }
}
