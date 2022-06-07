import { IsString, MaxLength, MinLength } from "class-validator";

export class UpdateTodoTitleParams {
  @IsString()
  todoId!: string;

  @IsString()
  todoListId!: string;
}

export class UpdateTodoTitleBody {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  title!: string;
}
