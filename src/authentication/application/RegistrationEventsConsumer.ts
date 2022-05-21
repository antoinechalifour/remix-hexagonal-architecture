import assert from "assert";
import { Inject, Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { MAILER, Mailer } from "shared/mail";
import { UserRegistered } from "../domain/UserRegistered";

@Injectable()
export class RegistrationEventsConsumer {
  private readonly baseUrl: string;

  constructor(
    @Inject(MAILER)
    private readonly mailer: Mailer
  ) {
    assert(process.env.BASE_URL, "no base url configured");
    this.baseUrl = process.env.BASE_URL;
  }

  @OnEvent(UserRegistered.TYPE)
  async subscribe(event: UserRegistered) {
    await this.mailer.send({
      to: event.email,
      templateId: "d-5a6d53b34cb0463bb1d7dc17c06a1aca",
      data: {
        verify_account_url: `${this.baseUrl}/verify-account?email=${event.email}&token=${event.verificationToken}`,
      },
    });
  }
}
