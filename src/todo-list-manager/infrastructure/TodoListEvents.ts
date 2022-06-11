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

  publish(event: TodoListEvent): void {
    this.todoListEventDatabaseRepository
      .save(event)
      .then(() => this.events.publish(event))
      .catch();
  }
}
