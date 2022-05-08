import { Inject, Injectable } from "@nestjs/common";
import type { PrismaClient } from "@prisma/client";
import type { TodoList, TodoListId } from "../domain/TodoList";
import type { TodoLists } from "../domain/TodoLists";
import type { OwnerId } from "../domain/OwnerId";
import { PRISMA } from "../keys";

@Injectable()
export class TodoListPrismaRepository implements TodoLists {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  async ofId(todoListId: TodoListId, ownerId: OwnerId): Promise<TodoList> {
    const todoList = await this.prisma.todoList.findFirst({
      where: {
        id: todoListId,
        ownerId,
      },
    });

    if (!todoList) throw new Error(`Todolist ${todoListId} was not found`);

    return {
      id: todoList.id,
      createdAt: todoList.createdAt.toISOString(),
      title: todoList.title,
      ownerId,
      todosOrder: [],
    };
  }

  async all(ownerId: OwnerId): Promise<TodoList[]> {
    const todoLists = await this.prisma.todoList.findMany({
      where: { ownerId },
    });

    return todoLists.map((row) => ({
      id: row.id,
      createdAt: row.createdAt.toISOString(),
      title: row.title,
      ownerId,
      todosOrder: [],
    }));
  }

  async save(todoList: TodoList): Promise<void> {
    await this.prisma.todoList.upsert({
      where: { id: todoList.id },
      update: {
        title: todoList.title,
      },
      create: {
        id: todoList.id,
        title: todoList.title,
        createdAt: new Date(todoList.createdAt),
        ownerId: todoList.ownerId,
      },
    });
  }

  async remove(todoListId: TodoListId, ownerId: OwnerId): Promise<void> {
    await this.prisma.todo.deleteMany({
      where: { todoListId, ownerId },
    });
    await this.prisma.todoList.deleteMany({
      where: { id: todoListId, ownerId },
    });
  }
}
