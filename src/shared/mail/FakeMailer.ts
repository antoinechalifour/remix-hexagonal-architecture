import { Injectable } from "@nestjs/common";
import { Mail } from "./Mail";
import { Mailer } from "./Mailer";

@Injectable()
export class FakeMailer implements Mailer {
  async send(mail: Mail): Promise<void> {
    console.log(mail);
  }
}
