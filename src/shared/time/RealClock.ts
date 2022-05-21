import { Injectable } from "@nestjs/common";
import type { Clock } from "./Clock";

@Injectable()
export class RealClock implements Clock {
  now(): Date {
    return new Date();
  }
}
