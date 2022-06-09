import { Event } from "shared/events";

export class UserRegistered extends Event {
  static TYPE = "user.registered";

  constructor(
    public readonly email: string,
    public readonly verificationToken: string,
    publishedAt: Date
  ) {
    super(UserRegistered.TYPE, publishedAt);
  }
}
