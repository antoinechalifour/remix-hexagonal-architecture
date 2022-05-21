import { Injectable } from "@nestjs/common";
import sgMail from "@sendgrid/mail";

interface Mail {
  to: string;
  subject: string;
  content: string;
}

export const MAILER = Symbol("MAILER");

export interface Mailer {
  send(mail: Mail): Promise<void>;
}

@Injectable()
export class FakeMailer implements Mailer {
  send(mail: Mail): Promise<void> {
    console.log(mail);
    return Promise.resolve(undefined);
  }
}

@Injectable()
export class SendGridMailer implements Mailer {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  }

  async send(mail: Mail): Promise<void> {
    const msg = {
      to: "antoine.chalifour@gmail.com", // Change to your recipient
      from: "antoine.chalifour@gmail.com", // Change to your verified sender
      subject: mail.subject,
      html: mail.content,
    };

    await sgMail
      .send(msg)
      .then((response) => {
        console.log(response[0].statusCode);
        console.log(response[0].headers);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
