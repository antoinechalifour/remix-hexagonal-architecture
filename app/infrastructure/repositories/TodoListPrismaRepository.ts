import type { PrismaClient } from "@prisma/client";
import type { TodoLists } from "../../domain/TodoLists";
import type { TodoList } from "../../domain/TodoList";

interface TodoListPrismaRepositoryOptions {
  prisma: PrismaClient;
}

export class TodoListPrismaRepository implements TodoLists {
  private readonly prisma;

  constructor({ prisma }: TodoListPrismaRepositoryOptions) {
    this.prisma = prisma;
  }

  async ofId(todoListId: string): Promise<TodoList> {
    const todoList = await this.prisma.todoList.findFirst({
      where: {
        id: todoListId,
      },
    });

    if (!todoList) throw new Error(`Todolist ${todoListId} was not found`);

    return {
      id: todoList.id,
      createdAt: todoList.createdAt.toISOString(),
      title: todoList.title,
    };
  }

  async all(): Promise<TodoList[]> {
    const todoLists = await this.prisma.todoList.findMany();

    return todoLists.map((row) => ({
      id: row.id,
      createdAt: row.createdAt.toISOString(),
      title: row.title,
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
      },
    });
  }

  async remove(todoListId: string): Promise<void> {
    await this.prisma.todo.deleteMany();
    await this.prisma.todoList.delete({
      where: { id: todoListId },
    });
  }
}
