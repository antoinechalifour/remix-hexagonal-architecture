import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class LoginBody {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(4)
  password!: string;

  @IsOptional()
  register: unknown;
}
