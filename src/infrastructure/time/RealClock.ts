import type { Clock } from "../../todo-list-manager/domain/Clock";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RealClock implements Clock {
  now(): Date {
    return new Date();
  }
}
