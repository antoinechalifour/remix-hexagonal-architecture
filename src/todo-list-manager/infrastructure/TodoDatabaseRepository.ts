import { Injectable } from "@nestjs/common";
import { PrismaRepository } from "../../shared/PrismaRepository";
import type { Todos } from "../domain/Todos";
import type { TodoListId } from "../domain/TodoList";
import type { Todo, TodoId } from "../domain/Todo";
import { OwnerId } from "../domain/OwnerId";

@Injectable()
export class TodoDatabaseRepository extends PrismaRepository implements Todos {
  async ofId(todoId: TodoId, ownerId: OwnerId): Promise<Todo> {
    const row = await this.prisma.todo.findFirst({
      where: { id: todoId, ownerId },
      rejectOnNotFound: true,
    });

    return {
      id: row.id,
      title: row.title,
      isComplete: row.isComplete,
      createdAt: row.createdAt.toISOString(),
      todoListId: row.todoListId,
      ownerId,
      tags: row.tags as string[],
    };
  }

  async ofTodoList(todoListId: TodoListId, ownerId: OwnerId): Promise<Todo[]> {
    const todos = await this.prisma.todo.findMany({
      where: {
        todoListId,
        ownerId,
      },
    });

    return todos.map((row) => ({
      id: row.id,
      title: row.title,
      isComplete: row.isComplete,
      createdAt: row.createdAt.toISOString(),
      todoListId,
      ownerId,
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

  async remove(todoId: TodoId, ownerId: OwnerId): Promise<void> {
    await this.prisma.todo.deleteMany({
      where: { id: todoId, ownerId },
    });
  }
}
