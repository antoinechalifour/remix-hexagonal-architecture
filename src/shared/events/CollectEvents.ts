import { Events } from "./Events";
import { Event } from "./Event";

export class CollectEvents implements Events {
  private events: Event[] = [];

  publish<T extends Event>(event: T): void {
    this.events.push(event);
  }

  collected() {
    return this.events;
  }
}
