import { IsInt, IsString, Min } from "class-validator";
import { Type } from "class-transformer";

export class ReorderTodosParams {
  @IsString()
  todoListId!: string;
}

export class ReorderTodosBody {
  @IsString()
  todoId!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  newIndex!: number;
}
