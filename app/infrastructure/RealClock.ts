import type { Clock } from "~/domain/Clock";

export class RealClock implements Clock {
  now(): Date {
    return new Date();
  }
}
