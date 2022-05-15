import { IsString, MaxLength, MinLength } from "class-validator";

export class RenameTodoParams {
  @IsString()
  todoId!: string;

  @IsString()
  todoListId!: string;
}

export class RenameTodoBody {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  title!: string;
}
