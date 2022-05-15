import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class AddTodoBody {
  @IsString()
  @IsNotEmpty({ message: "The title of your todo is required." })
  @MaxLength(50, {
    message: "The title of your todo is limited to 50 characters.",
  })
  todoTitle!: string;
}

export class AddTodoParams {
  @IsString()
  todoListId!: string;
}
