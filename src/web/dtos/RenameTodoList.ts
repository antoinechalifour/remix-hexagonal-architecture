import { IsString, MinLength } from "class-validator";

export class RenameTodoListDto {
  @IsString()
  @MinLength(1)
  todoListTitle!: string;
}

export class RenameTodoListParams {
  @IsString()
  todoListId!: string;
}
