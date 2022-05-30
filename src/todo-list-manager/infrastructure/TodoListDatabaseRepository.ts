import type { TodoList, TodoListId } from "../domain/TodoList";
import type { TodoLists } from "../domain/TodoLists";
import { Injectable } from "@nestjs/common";
import { PrismaRepository } from "shared/database";
import { TodoListNotFoundError } from "../domain/TodoListNotFoundError";

@Injectable()
export class TodoListDatabaseRepository
  extends PrismaRepository
  implements TodoLists
{
  async ofId(todoListId: TodoListId): Promise<TodoList> {
    const row = await this.prisma.todoList.findFirst({
      where: { id: todoListId },
    });

    if (!row) throw new TodoListNotFoundError(todoListId);

    return {
      id: row.id,
      createdAt: row.createdAt.toISOString(),
      title: row.title,
      todosOrder: row.todosOrder as string[],
    };
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
        todosOrder: todoList.todosOrder,
      },
    });
  }

  async remove(todoListId: TodoListId): Promise<void> {
    await this.prisma.todo.deleteMany({
      where: { todoListId },
    });
    await this.prisma.todoList.deleteMany({
      where: { id: todoListId },
    });
  }
}
