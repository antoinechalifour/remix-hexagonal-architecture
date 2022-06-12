import { Injectable } from "@nestjs/common";
import { PrismaRepository } from "shared/database";
import { TodoListEvent } from "../domain/event/TodoListEvent";

@Injectable()
export class TodoListEventDatabaseRepository extends PrismaRepository {
  async save(event: TodoListEvent) {
    await this.prisma.todoListEvent.create({
      data: {
        id: event.id,
        todoListId: event.todoListId,
        publishedAt: event.publishedAt,
        event: JSON.stringify(event),
      },
    });
  }
}
