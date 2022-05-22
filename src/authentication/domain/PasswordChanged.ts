import { Event } from "shared/events";

export class PasswordChanged extends Event {
  static TYPE = "user.password-changed";

  constructor(public readonly email: string) {
    super(PasswordChanged.TYPE);
  }
}
