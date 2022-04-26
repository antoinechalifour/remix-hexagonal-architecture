import { IsString } from "class-validator";

export class FetchTodoListParams {
  @IsString()
  todoListId!: string;
}
