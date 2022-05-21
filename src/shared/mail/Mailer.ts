import { Mail } from "./Mail";

export const MAILER = Symbol("MAILER");

export interface Mailer {
  send(mail: Mail): Promise<void>;
}
