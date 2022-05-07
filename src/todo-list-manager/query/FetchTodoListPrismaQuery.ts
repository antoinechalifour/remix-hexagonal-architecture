import type { PrismaClient } from "@prisma/client";
import { Inject, Injectable } from "@nestjs/common";
import type { TodoListDto } from "shared";
import type { TodoListId } from "../domain/TodoList";
import { PRISMA } from "../keys";
import type { FetchTodoListQuery } from "./FetchTodoListQuery";
import type { OwnerId } from "../domain/OwnerId";

type TodoListRow = { id: string; title: string; createdAt: string };

type TodoRow<Completion extends boolean> = {
  id: string;
  title: string;
  isComplete: Completion;
  createdAt: string;
};

@Injectable()
export class FetchTodoListPrismaQuery implements FetchTodoListQuery {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  async run(todoListId: TodoListId, ownerId: OwnerId): Promise<TodoListDto> {
    const [todoList, doingTodos, completedTodos] = await Promise.all([
      this.fetchTodoList(todoListId, ownerId),
      this.fetchDoingTodos(todoListId, ownerId),
      this.fetchCompleteTodos(todoListId, ownerId),
    ]);

    if (!todoList)
      throw new Response(`Todo list "${todoListId}" was not found.`);

    return {
      ...todoList,
      doingTodos,
      completedTodos,
    };
  }

  private fetchTodoList(todoListId: TodoListId, ownerId: OwnerId) {
    return this.prisma.$queryRaw<TodoListRow[]>`
        SELECT TL.id, TL.title, TL."createdAt"
        FROM "TodoList" TL
        WHERE TL.id = ${todoListId} AND TL."ownerId" = ${ownerId};
    `.then((rows) => rows[0]);
  }

  private fetchDoingTodos(todoListId: TodoListId, ownerId: OwnerId) {
    return this.prisma.$queryRaw<TodoRow<false>[]>`
        SELECT id, title, "isComplete", "createdAt" FROM "Todo"
        WHERE "isComplete" IS false AND "todoListId" = ${todoListId} AND "ownerId" = ${ownerId};
    `;
  }

  private fetchCompleteTodos(todoListId: TodoListId, ownerId: OwnerId) {
    return this.prisma.$queryRaw<TodoRow<true>[]>`
        SELECT id, title, "isComplete", "createdAt" FROM "Todo"
        WHERE "isComplete" IS true AND "todoListId" = ${todoListId} AND "ownerId" = ${ownerId};
    `;
  }
}
