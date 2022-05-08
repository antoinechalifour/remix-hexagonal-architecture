import { IsInt, IsPositive, IsString } from "class-validator";
import { Type } from "class-transformer";

export class ReorderTodosParams {
  @IsString()
  todoListId!: string;
}

export class ReorderTodosBody {
  @IsString()
  todoId!: string;

  @Type(() => Number)
  @IsPositive()
  @IsInt()
  newIndex!: number;
}
