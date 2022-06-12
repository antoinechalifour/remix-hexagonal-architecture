import { v4 as uuid } from "uuid";

export class Event {
  public readonly id = uuid();

  constructor(
    public readonly type: string,
    public readonly publishedAt: Date
  ) {}
}
