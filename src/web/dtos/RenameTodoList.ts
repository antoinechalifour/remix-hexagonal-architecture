import { IsString, MinLength } from "class-validator";

export class RenameTodoListBody {
  @IsString()
  @MinLength(1)
  title!: string;
}

export class RenameTodoListParams {
  @IsString()
  todoListId!: string;
}
