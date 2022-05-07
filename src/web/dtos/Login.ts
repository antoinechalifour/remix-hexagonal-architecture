import { IsOptional, IsString } from "class-validator";

export class LoginBody {
  @IsString()
  email!: string;

  @IsString()
  password!: string;

  @IsOptional()
  register: unknown;
}
