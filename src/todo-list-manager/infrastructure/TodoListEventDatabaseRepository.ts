import { Injectable } from "@nestjs/common";
import { PrismaRepository } from "shared/database";
import { v4 as uuid } from "uuid";
import { TodoListEvent } from "../domain/event/TodoListEvent";

@Injectable()
export class TodoListEventDatabaseRepository extends PrismaRepository {
  async save(event: TodoListEvent) {
    await this.prisma.todoListEvent.create({
      data: {
        id: uuid(),
        todoListId: event.todoListId,
        publishedAt: event.publishedAt,
        event: JSON.stringify(event),
      },
    });
  }
}
