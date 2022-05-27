import { IsString } from "class-validator";

export class ShareTodoListParams {
  @IsString()
  todoListId!: string;
}

export class ShareTodoListBody {
  @IsString()
  email!: string;
}
