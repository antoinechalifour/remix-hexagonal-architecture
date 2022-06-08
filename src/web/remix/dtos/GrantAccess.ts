import { IsString } from "class-validator";

export class GrantAccessParams {
  @IsString()
  todoListId!: string;
}

export class GrantAccessBody {
  @IsString()
  email!: string;
}
