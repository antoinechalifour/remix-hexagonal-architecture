import { Event } from "shared/events";

export class AccessRevoked extends Event {
  static TYPE = "todoList.accessRevoked";

  constructor(
    public readonly todoListId: string,
    public readonly contributorId: string,
    public readonly previousContributorId: string,
    publishedAt: Date
  ) {
    super(AccessRevoked.TYPE, publishedAt);
  }
}
