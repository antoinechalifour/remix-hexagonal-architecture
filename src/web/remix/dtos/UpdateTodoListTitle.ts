import { IsString, MaxLength, MinLength } from "class-validator";

export class UpdateTodoListTitleBody {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  title!: string;
}

export class UpdateTodoListTitleParams {
  @IsString()
  todoListId!: string;
}
