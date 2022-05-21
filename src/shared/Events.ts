export class Event {
  constructor(public readonly type: string) {}
}

export interface Events {
  publish<T extends Event>(event: T): void;
}
