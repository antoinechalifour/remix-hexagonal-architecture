import type { Todos } from "../domain/Todos";
import type { TodoListId } from "../domain/TodoList";
import type { Todo, TodoId } from "../domain/Todo";
import { Injectable } from "@nestjs/common";
import { PrismaRepository } from "shared/database";

@Injectable()
export class TodoDatabaseRepository extends PrismaRepository implements Todos {
  async ofId(todoId: TodoId): Promise<Todo> {
    const row = await this.prisma.todo.findFirst({
      where: { id: todoId },
      rejectOnNotFound: true,
    });

    return {
      id: row.id,
      title: row.title,
      isComplete: row.isComplete,
      createdAt: row.createdAt.toISOString(),
      todoListId: row.todoListId,
      ownerId: row.ownerId,
      tags: row.tags as string[],
    };
  }

  async ofTodoList(todoListId: TodoListId): Promise<Todo[]> {
    const todos = await this.prisma.todo.findMany({
      where: { todoListId },
    });

    return todos.map((row) => ({
      id: row.id,
      title: row.title,
      isComplete: row.isComplete,
      createdAt: row.createdAt.toISOString(),
      todoListId,
      ownerId: row.ownerId,
      tags: row.tags as string[],
    }));
  }

  async save(todo: Todo): Promise<void> {
    await this.prisma.todo.upsert({
      where: { id: todo.id },
      update: {
        isComplete: todo.isComplete,
        title: todo.title,
        tags: todo.tags,
      },
      create: {
        id: todo.id,
        title: todo.title,
        isComplete: todo.isComplete,
        createdAt: new Date(todo.createdAt),
        todoListId: todo.todoListId,
        ownerId: todo.ownerId,
        tags: todo.tags,
      },
    });
  }

  async remove(todoId: string): Promise<void> {
    await this.prisma.todo.deleteMany({
      where: { id: todoId },
    });
  }
}
