import { Event } from "./Event";

export interface Events<T extends Event = Event> {
  publish(event: T): void;
}
