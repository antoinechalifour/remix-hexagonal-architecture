import { Event } from "./Event";

export interface Events {
  publish<T extends Event>(event: T): void;
}
