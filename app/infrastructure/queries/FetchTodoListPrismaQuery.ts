import type { PrismaClient } from "@prisma/client";
import type { FetchTodoListQuery } from "~/query/FetchTodoListQuery";
import type { TodoListId } from "~/domain/TodoList";
import type { TodoListReadModel } from "~/query/TodoListReadModel";
import { todoListNotFound } from "~/infrastructure/errors";

interface FetchTodoListPrismaQueryOptions {
  prisma: PrismaClient;
}

export class FetchTodoListPrismaQuery implements FetchTodoListQuery {
  private readonly prisma;

  constructor({ prisma }: FetchTodoListPrismaQueryOptions) {
    this.prisma = prisma;
  }

  async run(todoListId: TodoListId): Promise<TodoListReadModel> {
    const [todoList, doingTodos, completedTodos] = await Promise.all([
      this.fetchTodoList(todoListId),
      this.fetchDoingTodos(todoListId),
      this.fetchCompleteTodos(todoListId),
    ]);

    if (!todoList) todoListNotFound(todoListId);

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
