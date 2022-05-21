import { Event } from "../../shared/Events";

export class UserRegistered extends Event {
  static TYPE = "user.registered";

  constructor(public readonly email: string) {
    super(UserRegistered.TYPE);
  }
}
