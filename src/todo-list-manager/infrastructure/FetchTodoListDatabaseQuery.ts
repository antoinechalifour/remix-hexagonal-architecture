import type { PrismaClient } from "@prisma/client";
import type { TodoListDto } from "shared/client";
import type { TodoListId } from "../domain/TodoList";
import type { FetchTodoList } from "../domain/FetchTodoList";
import type { OwnerId } from "../domain/OwnerId";
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
  isComplete: Completion;
  createdAt: string;
  tags: string[];
};

@Injectable()
export class FetchTodoListDatabaseQuery implements FetchTodoList {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  async run(todoListId: TodoListId, ownerId: OwnerId): Promise<TodoListDto> {
    const [{ todosOrder, ...todoList }, tags] = await Promise.all([
      this.fetchTodoList(todoListId, ownerId),
      this.fetchTodoListTags(todoListId, ownerId),
    ]);
    const [doingTodos, completedTodos] = await Promise.all([
      this.fetchDoingTodos(todoListId, ownerId),
      this.fetchCompleteTodos(todoListId, ownerId),
    ]);

    if (!todoList)
      throw new Response(`Todo list "${todoListId}" was not found.`);

    return {
      ...todoList,
      tags,
      doingTodos: this.sortTodos(doingTodos, todosOrder),
      completedTodos: this.sortTodos(completedTodos, todosOrder),
    };
  }

  private fetchTodoList(todoListId: TodoListId, ownerId: OwnerId) {
    return this.prisma.$queryRaw<TodoListRow[]>`
      SELECT TL.id, TL.title, TL."createdAt", TL."todosOrder"
      FROM "TodoList" TL
      INNER JOIN "TodoListPermission" TLP on TL."id" = TLP."todoListId"
      WHERE TL.id = ${todoListId} AND TLP."ownerId" = ${ownerId};
    `.then((rows) => rows[0]);
  }

  private fetchDoingTodos(todoListId: TodoListId, ownerId: OwnerId) {
    return this.prisma.$queryRaw<TodoRow<false>[]>`
      SELECT T.id, T.title, T."isComplete", T."createdAt", T.tags FROM "Todo" T
      INNER JOIN "TodoListPermission" TLP on T."todoListId" = TLP."todoListId"
      WHERE T."isComplete" IS false
      AND T."todoListId" = ${todoListId} AND TLP."ownerId" = ${ownerId};
    `;
  }

  private fetchCompleteTodos(todoListId: TodoListId, ownerId: OwnerId) {
    return this.prisma.$queryRaw<TodoRow<true>[]>`
      SELECT T.id, T.title, T."isComplete", T."createdAt", T.tags FROM "Todo" T
      INNER JOIN "TodoListPermission" TLP on T."todoListId" = TLP."todoListId"
      WHERE T."isComplete" IS true
      AND T."todoListId" = ${todoListId} AND TLP."ownerId" = ${ownerId};
    `;
  }

  private async fetchTodoListTags(todoListId: TodoListId, ownerId: OwnerId) {
    const rows = await this.prisma.$queryRaw<{ tag: string }[]>`
      SELECT DISTINCT jsonb_array_elements_text(T.tags) AS tag
      FROM "Todo" T
      INNER JOIN "TodoListPermission" TLP on T."todoListId" = TLP."todoListId"
      WHERE T."todoListId" = ${todoListId} AND TLP."ownerId" = ${ownerId}
      ORDER BY tag;
    `;

    return rows.map((row) => row.tag);
  }

  private sortTodos<T extends boolean>(todos: TodoRow<T>[], order: string[]) {
    const position = (idToCheck: string) =>
      order.findIndex((id) => idToCheck === id) ?? 0;
    return todos.sort((t1, t2) => position(t1.id) - position(t2.id));
  }
}
