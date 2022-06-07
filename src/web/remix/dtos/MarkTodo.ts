import { IsIn, IsString } from "class-validator";

export class MarkTodoParams {
  @IsString()
  todoId!: string;

  @IsString()
  todoListId!: string;
}

export class MarkTodoBody {
  @IsString()
  @IsIn(["on", "off"])
  isChecked!: string;
}
