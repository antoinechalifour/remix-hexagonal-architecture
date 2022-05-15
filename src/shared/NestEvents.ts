import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Events, Event } from "./Events";

@Injectable()
export class NestEvents implements Events {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  publish<T extends Event>(event: T) {
    this.eventEmitter
      .emitAsync(event.type, event)
      .catch((err) => console.log(err));
  }
}
