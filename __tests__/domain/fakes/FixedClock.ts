import type { Clock } from "~/domain/Clock";

export class FixedClock implements Clock {
  constructor(private fixedTime = new Date("2022-01-05T12:00:00.000Z")) {}

  now(): Date {
    return this.fixedTime;
  }
}
