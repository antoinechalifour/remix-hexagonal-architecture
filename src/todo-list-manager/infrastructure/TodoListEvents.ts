import { Event, Events, NestEvents } from "shared/events";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TodoListEvents implements Events {
  constructor(private readonly events: NestEvents) {}

  publish<T extends Event>(event: T): void {
    this.events.publish(event);
  }
}
