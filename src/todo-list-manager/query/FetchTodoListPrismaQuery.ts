import type { PrismaClient } from "@prisma/client";
import { Inject, Injectable } from "@nestjs/common";
import type { TodoListDto } from "shared";
import type { TodoListId } from "../domain/TodoList";
import { PRISMA } from "../keys";
import type { FetchTodoListQuery } from "./FetchTodoListQuery";

@Injectable()
export class FetchTodoListPrismaQuery implements FetchTodoListQuery {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  async run(todoListId: TodoListId): Promise<TodoListDto> {
    const [todoList, doingTodos, completedTodos] = await Promise.all([
      this.fetchTodoList(todoListId),
      this.fetchDoingTodos(todoListId),
      this.fetchCompleteTodos(todoListId),
    ]);

    if (!todoList)
      throw new Response(`Todo list "${todoListId}" was not found.`);

    return {
      ...todoList,
      doingTodos,
      completedTodos,
    };
  }

  private fetchTodoList(todoListId: TodoListId) {
    return this.prisma.$queryRaw<any[]>`
        SELECT TL.id, TL.title, TL.createdAt
        FROM TodoList TL
        WHERE TL.id=${todoListId};
    `.then((rows) => rows[0]);
  }

  private fetchDoingTodos(todoListId: TodoListId) {
    return this.prisma.$queryRaw<any[]>`
        SELECT id, title, isComplete, createdAt FROM Todo
        WHERE isComplete IS false AND todoListId=${todoListId};
    `;
  }

  private fetchCompleteTodos(todoListId: TodoListId) {
    return this.prisma.$queryRaw<any[]>`
        SELECT id, title, isComplete, createdAt FROM Todo
        WHERE isComplete IS true AND todoListId=${todoListId};
    `;
  }
}
