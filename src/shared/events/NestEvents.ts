import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Events } from "./Events";
import { Event } from "./Event";

@Injectable()
export class NestEvents implements Events {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async publish(event: Event) {
    this.eventEmitter.emit(event.type, event);
  }
}
