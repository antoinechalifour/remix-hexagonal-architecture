export class Event {
  constructor(
    public readonly type: string,
    public readonly publishedAt: Date
  ) {}
}
