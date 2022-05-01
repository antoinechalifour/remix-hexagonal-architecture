import { Inject, Injectable } from "@nestjs/common";
import type { PrismaClient } from "@prisma/client";
import type { Todos } from "../domain/Todos";
import type { TodoListId } from "../domain/TodoList";
import type { Todo, TodoId } from "../domain/Todo";
import { PRISMA } from "../keys";

@Injectable()
export class TodoPrismaRepository implements Todos {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  async ofId(todoId: TodoId): Promise<Todo> {
    const row = await this.prisma.todo.findUnique({
      where: { id: todoId },
      rejectOnNotFound: true,
    });

    return {
      id: row.id,
      title: row.title,
      isComplete: row.isComplete,
      createdAt: row.createdAt.toISOString(),
      todoListId: row.todoListId,
    };
  }

  async ofTodoList(todoListId: TodoListId): Promise<Todo[]> {
    const todos = await this.prisma.todo.findMany({
      where: {
        todoListId,
      },
    });

    return todos.map((row) => ({
      id: row.id,
      title: row.title,
      isComplete: row.isComplete,
      createdAt: row.createdAt.toISOString(),
      todoListId,
    }));
  }

  async save(todo: Todo): Promise<void> {
    await this.prisma.todo.upsert({
      where: { id: todo.id },
      update: { isComplete: todo.isComplete },
      create: {
        id: todo.id,
        title: todo.title,
        isComplete: todo.isComplete,
        createdAt: new Date(todo.createdAt),
        todoListId: todo.todoListId,
      },
    });
  }

  async remove(todoId: TodoId): Promise<void> {
    await this.prisma.todo.delete({
      where: { id: todoId },
    });
  }
}
