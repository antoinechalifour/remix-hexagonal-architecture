import { IsString } from "class-validator";

export class RevokeAccessParams {
  @IsString()
  todoListId!: string;
}

export class RevokeAccessBody {
  @IsString()
  contributorId!: string;
}
