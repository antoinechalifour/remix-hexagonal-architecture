import { Event } from "shared/events";

export class PasswordForgotten extends Event {
  static TYPE = "user.password-forgotten";

  constructor(
    public readonly email: string,
    public readonly passwordResetToken: string,
    publishedAt: Date
  ) {
    super(PasswordForgotten.TYPE, publishedAt);
  }
}
