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
      isDone: row.isDone,
      createdAt: row.createdAt,
      doneAt: row.doneAt,
      todoListId: row.todoListId,
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
      isDone: row.isDone,
      doneAt: row.doneAt,
      createdAt: row.createdAt,
      todoListId,
      tags: row.tags as string[],
    }));
  }

  async save(todo: Todo): Promise<void> {
    await this.prisma.todo.upsert({
      where: { id: todo.id },
      update: {
        isDone: todo.isDone,
        doneAt: todo.doneAt,
        title: todo.title,
        tags: todo.tags,
      },
      create: {
        id: todo.id,
        title: todo.title,
        isDone: todo.isDone,
        doneAt: todo.doneAt,
        createdAt: new Date(todo.createdAt),
        todoListId: todo.todoListId,
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
