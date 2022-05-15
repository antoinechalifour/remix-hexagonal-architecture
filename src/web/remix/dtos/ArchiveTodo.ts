import { IsString } from "class-validator";

export class ArchiveTodoParams {
  @IsString()
  todoId!: string;

  @IsString()
  todoListId!: string;
}
