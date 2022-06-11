import { Events } from "./Events";
import { Event } from "./Event";

export class CollectEvents implements Events {
  private events: Event[] = [];

  publish(event: Event): void {
    this.events.push(event);
  }

  collected() {
    return this.events;
  }
}
