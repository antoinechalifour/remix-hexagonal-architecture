import { IsString } from "class-validator";

export class VerifyAccountQuery {
  @IsString()
  email!: string;

  @IsString()
  token!: string;
}
