import { IsString, MaxLength, MinLength } from "class-validator";

export class AddTagToTodoParams {
  @IsString()
  todoId!: string;

  @IsString()
  todoListId!: string;
}

export class AddTagToTodoBody {
  @IsString()
  @MinLength(1)
  @MaxLength(15)
  tag!: string;
}
