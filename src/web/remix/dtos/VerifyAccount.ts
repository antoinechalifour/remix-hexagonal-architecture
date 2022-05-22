import { IsEmail, IsString } from "class-validator";

export class VerifyAccountQuery {
  @IsEmail()
  email!: string;

  @IsString()
  token!: string;
}
