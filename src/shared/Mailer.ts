import assert from "assert";
import { Injectable } from "@nestjs/common";
import sgMail from "@sendgrid/mail";

interface Mail {
  to: string;
  templateId: string;
  data: Record<string, any>;
}

export const MAILER = Symbol("MAILER");

export interface Mailer {
  send(mail: Mail): Promise<void>;
}

@Injectable()
export class FakeMailer implements Mailer {
  async send(mail: Mail): Promise<void> {
    console.log(mail);
  }
}

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
