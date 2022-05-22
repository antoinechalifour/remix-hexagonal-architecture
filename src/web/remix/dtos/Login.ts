import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class LoginBody {
  @IsEmail(undefined, { message: "This email doesn't seem to be valid." })
  email!: string;

  @IsString()
  @MinLength(8, { message: "Your password must be at least 4 characters" })
  @MaxLength(64, { message: "Your password must be at most 64 characters" })
  password!: string;

  @IsOptional()
  register: unknown;
}
