import { IsInt, IsString, Min } from "class-validator";
import { Type } from "class-transformer";

export class ReorderTodoParams {
  @IsString()
  todoListId!: string;
}

export class ReorderTodoBody {
  @IsString()
  todoId!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  newIndex!: number;
}
