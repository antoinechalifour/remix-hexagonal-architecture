import { IsEmail, IsString, MinLength } from "class-validator";

export class ResetPasswordBody {
  @IsEmail()
  email!: string;

  @IsString()
  token!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}