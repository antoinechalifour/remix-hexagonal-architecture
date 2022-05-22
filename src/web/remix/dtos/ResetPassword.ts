import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class ResetPasswordBody {
  @IsEmail()
  email!: string;

  @IsString()
  token!: string;

  @IsString()
  @MinLength(8, { message: "Your password must be at least 4 characters" })
  @MaxLength(64, { message: "Your password must be at most 64 characters" })
  password!: string;
}
