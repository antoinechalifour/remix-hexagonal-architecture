import { IsEmail } from "class-validator";

export class ForgotPasswordBody {
  @IsEmail()
  email!: string;
}