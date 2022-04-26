import { IsString } from "class-validator";

export class ArchiveTodoListParams {
  @IsString()
  todoListId!: string;
}
