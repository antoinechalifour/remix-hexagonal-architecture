import { Events, NestEvents } from "shared/events";
import { Injectable } from "@nestjs/common";
import { TodoListEvent } from "../domain/TodoListEvent";
import { TodoListEventDatabaseRepository } from "./TodoListEventDatabaseRepository";

@Injectable()
export class TodoListEvents implements Events<TodoListEvent> {
  constructor(
    private readonly events: NestEvents,
    private readonly todoListEventDatabaseRepository: TodoListEventDatabaseRepository
  ) {}

  async publish(event: TodoListEvent): Promise<void> {
    await this.todoListEventDatabaseRepository;
    await this.events.publish(event);
  }
}
