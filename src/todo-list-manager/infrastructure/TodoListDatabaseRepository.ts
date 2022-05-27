import type { TodoList, TodoListId } from "../domain/TodoList";
import type { TodoLists } from "../domain/TodoLists";
import { Injectable } from "@nestjs/common";
import { PrismaRepository } from "shared/database";

@Injectable()
export class TodoListDatabaseRepository
  extends PrismaRepository
  implements TodoLists
{
  async ofId(todoListId: TodoListId): Promise<TodoList> {
    const todoList = await this.prisma.todoList.findFirst({
      where: { id: todoListId },
    });

    if (!todoList) throw new Error(`Todolist ${todoListId} was not found`);

    return {
      id: todoList.id,
      createdAt: todoList.createdAt.toISOString(),
      title: todoList.title,
      todosOrder: todoList.todosOrder as string[],
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
