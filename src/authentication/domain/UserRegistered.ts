import { Event } from "../../shared/Events";

export class UserRegistered extends Event {
  static TYPE = "user.registered";

  constructor(
    public readonly email: string,
    public readonly verificationToken: string
  ) {
    super(UserRegistered.TYPE);
  }
}
