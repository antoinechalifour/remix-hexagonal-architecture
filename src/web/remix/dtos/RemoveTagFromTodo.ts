import { IsString, MaxLength, MinLength } from "class-validator";

export class RemoveTagFromTodoParams {
  @IsString()
  todoId!: string;

  @IsString()
  todoListId!: string;
}

export class RemoveTagFromTodoBody {
  @IsString()
  @MinLength(1)
  @MaxLength(15)
  tag!: string;
}
