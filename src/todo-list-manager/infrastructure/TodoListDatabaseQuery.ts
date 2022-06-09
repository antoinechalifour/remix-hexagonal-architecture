import type { PrismaClient } from "@prisma/client";
import type { TodoListDetailsDto, TodoListSummaryDto } from "shared/client";
import type { TodoListId } from "../domain/TodoList";
import type { TodoListQuery } from "../domain/TodoListQuery";
import { Prisma } from "@prisma/client";
import { Inject, Injectable } from "@nestjs/common";
import { PRISMA } from "../../keys";

type TodoListRow = {
  id: string;
  title: string;
  createdAt: string;
  todosOrder: string[];
};

type TodoRow<Completion extends boolean> = {
  id: string;
  title: string;
  isDone: Completion;
  createdAt: string;
  tags: string[];
};

@Injectable()
export class TodoListDatabaseQuery implements TodoListQuery {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  async detailsOfTodoList(todoListId: TodoListId): Promise<TodoListDetailsDto> {
    const [{ todosOrder, ...todoList }, tags] = await Promise.all([
      this.fetchTodoList(todoListId),
      this.fetchTodoListTags(todoListId),
    ]);
    const [doingTodos, doneTodos] = await Promise.all([
      this.fetchDoingTodos(todoListId),
      this.fetchDoneTodos(todoListId),
    ]);

    return {
      ...todoList,
      tags,
      doingTodos: this.sortTodos(doingTodos, todosOrder),
      doneTodos,
    };
  }

  async summaryOfTodoLists(
    todoListsIds: string[]
  ): Promise<TodoListSummaryDto[]> {
    if (todoListsIds.length === 0) return [];

    return this.fetchTodoLists(todoListsIds);
  }

  private fetchTodoList(todoListId: TodoListId) {
    return this.prisma.$queryRaw<TodoListRow[]>`
      SELECT TL.id, TL.title, TL."createdAt", TL."todosOrder"
      FROM "TodoList" TL
      WHERE TL.id = ${todoListId};
    `.then((rows) => rows[0]);
  }

  private fetchDoingTodos(todoListId: TodoListId) {
    return this.prisma.$queryRaw<TodoRow<false>[]>`
      SELECT T.id, T.title, T."isDone", T."createdAt", T.tags FROM "Todo" T
      WHERE T."isDone" IS false
      AND T."todoListId" = ${todoListId};
    `;
  }

  private fetchDoneTodos(todoListId: TodoListId) {
    return this.prisma.$queryRaw<TodoRow<true>[]>`
      SELECT T.id, T.title, T."isDone", T."createdAt", T.tags FROM "Todo" T
      WHERE T."isDone" IS true
      AND T."todoListId" = ${todoListId}
      ORDER BY t."doneAt" DESC;
    `;
  }

  private async fetchTodoListTags(todoListId: TodoListId) {
    const rows = await this.prisma.$queryRaw<{ tag: string }[]>`
      SELECT DISTINCT jsonb_array_elements_text(T.tags) AS tag
      FROM "Todo" T
      WHERE T."todoListId" = ${todoListId}
      ORDER BY tag;
    `;

    return rows.map((row) => row.tag);
  }

  private sortTodos<T extends boolean>(todos: TodoRow<T>[], order: string[]) {
    const position = (idToCheck: string) =>
      order.findIndex((id) => idToCheck === id) ?? 0;
    return todos.sort((t1, t2) => position(t1.id) - position(t2.id));
  }

  private fetchTodoLists(todoListsIds: TodoListId[]) {
    return this.prisma.$queryRaw<any[]>`
      SELECT TL.id, TL.title, TL."createdAt", count(T.id) as "numberOfTodos"
      FROM "TodoList" TL
      LEFT JOIN "Todo" T ON TL.id = T."todoListId" AND T."isDone" IS false
      WHERE TL."id" IN (${Prisma.join(todoListsIds)})
      GROUP BY TL.id, TL."createdAt"
      ORDER BY TL."createdAt" DESC;
    `;
  }
}
