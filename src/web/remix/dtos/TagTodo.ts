import { IsString, MaxLength, MinLength } from "class-validator";

export class TagTodoParams {
  @IsString()
  todoId!: string;

  @IsString()
  todoListId!: string;
}

export class TagTodoBody {
  @IsString()
  @MinLength(1)
  @MaxLength(15)
  tag!: string;
}
