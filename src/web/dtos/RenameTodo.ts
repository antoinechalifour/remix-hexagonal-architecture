import { IsString, MinLength } from "class-validator";

export class RenameTodoParams {
  @IsString()
  todoId!: string;

  @IsString()
  todoListId!: string;
}

export class RenameTodoBody {
  @IsString()
  @MinLength(1)
  title!: string;
}
