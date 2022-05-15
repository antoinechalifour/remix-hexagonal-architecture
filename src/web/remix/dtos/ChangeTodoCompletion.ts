import { IsIn, IsString } from "class-validator";

export class ChangeTodoCompletionParams {
  @IsString()
  todoId!: string;

  @IsString()
  todoListId!: string;
}

export class ChangeTodoCompletionBody {
  @IsString()
  @IsIn(["on", "off"])
  isChecked!: string;
}
