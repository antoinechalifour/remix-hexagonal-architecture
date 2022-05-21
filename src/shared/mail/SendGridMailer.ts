import assert from "assert";
import { Injectable } from "@nestjs/common";
import sgMail from "@sendgrid/mail";
import { Mail } from "./Mail";
import { Mailer } from "./Mailer";

@Injectable()
export class SendGridMailer implements Mailer {
  private readonly sender: string;

  constructor() {
    assert(process.env.SENDGRID_API_KEY, "No api key configured");
    assert(process.env.SENDGRID_SENDER, "No sender configured");

    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    this.sender = process.env.SENDGRID_SENDER;
  }

  async send(mail: Mail): Promise<void> {
    try {
      await sgMail.send({
        to: mail.to, // Change to your recipient
        from: this.sender, // Change to your verified sender
        templateId: mail.templateId,
        dynamicTemplateData: mail.data,
        hideWarnings: true,
      });
    } catch (error) {
      console.error(error);
    }
  }
}
