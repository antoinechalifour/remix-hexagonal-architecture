import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class LoginBody {
  @IsEmail(undefined, { message: "This email doesn't seem to be valid." })
  email!: string;

  @IsString()
  @MinLength(4, { message: "Your password must be at least 4 characters" })
  password!: string;

  @IsOptional()
  register: unknown;
}
