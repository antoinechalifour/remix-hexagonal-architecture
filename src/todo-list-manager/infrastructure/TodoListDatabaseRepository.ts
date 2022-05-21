import { Injectable } from "@nestjs/common";
import { PrismaRepository } from "shared/database";
import type { TodoList, TodoListId } from "../domain/TodoList";
import type { TodoLists } from "../domain/TodoLists";
import type { OwnerId } from "../domain/OwnerId";

@Injectable()
export class TodoListDatabaseRepository
  extends PrismaRepository
  implements TodoLists
{
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
      todosOrder: todoList.todosOrder as string[],
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
      todosOrder: row.todosOrder as string[],
    }));
  }

  async save(todoList: TodoList): Promise<void> {
    await this.prisma.todoList.upsert({
      where: { id: todoList.id },
      update: {
        title: todoList.title,
        todosOrder: todoList.todosOrder,
      },
      create: {
        id: todoList.id,
        title: todoList.title,
        createdAt: new Date(todoList.createdAt),
        ownerId: todoList.ownerId,
        todosOrder: todoList.todosOrder,
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
