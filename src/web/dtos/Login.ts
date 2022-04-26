import { IsString } from "class-validator";

export class LoginBody {
  @IsString()
  username!: string;

  @IsString()
  password!: string;
}
