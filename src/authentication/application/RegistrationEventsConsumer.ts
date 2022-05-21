import { Inject, Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { MAILER, Mailer } from "../../shared/Mailer";
import { UserRegistered } from "../domain/UserRegistered";

@Injectable()
export class RegistrationEventsConsumer {
  constructor(
    @Inject(MAILER)
    private readonly mailer: Mailer
  ) {}

  @OnEvent(UserRegistered.TYPE)
  async subscribe(event: UserRegistered) {
    await this.mailer.send({
      to: event.email,
      subject: "TodoListManager - Please verify your account",
      content: `/accounts/verify?token=${event.verificationToken}`,
    });
  }
}
