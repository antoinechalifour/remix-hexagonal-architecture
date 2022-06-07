import { IsString } from "class-validator";

export class DeleteTodoFromTodoListParams {
  @IsString()
  todoId!: string;

  @IsString()
  todoListId!: string;
}
