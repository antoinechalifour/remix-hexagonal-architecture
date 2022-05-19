import { IsString, MaxLength, MinLength } from "class-validator";

export class UntagTodoParams {
  @IsString()
  todoId!: string;

  @IsString()
  todoListId!: string;
}

export class UntagTodoBody {
  @IsString()
  @MinLength(1)
  @MaxLength(15)
  tag!: string;
}
