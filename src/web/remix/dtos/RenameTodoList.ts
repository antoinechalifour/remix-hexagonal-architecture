import { IsString, MaxLength, MinLength } from "class-validator";

export class RenameTodoListBody {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  title!: string;
}

export class RenameTodoListParams {
  @IsString()
  todoListId!: string;
}
