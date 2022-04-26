import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class AddTodoListBody {
  @IsString()
  @IsNotEmpty({ message: "The title of your todo list is required." })
  @MaxLength(60, {
    message: "The title of your todo list is limited to 60 characters.",
  })
  title!: string;
}
