import { IsString } from "class-validator";

export class UnshareTodoListParams {
  @IsString()
  todoListId!: string;
}

export class UnshareTodoListBody {
  @IsString()
  collaboratorId!: string;
}
