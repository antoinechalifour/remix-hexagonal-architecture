import { Event } from "shared/events";

export class PasswordForgotten extends Event {
  static TYPE = "user.password-forgotten";

  constructor(
    public readonly email: string,
    public readonly passwordResetToken: string
  ) {
    super(PasswordForgotten.TYPE);
  }
}
