import type { CompletedTodoDto, DoingTodoDto } from "./Todo";

export interface TodoListDto {
  id: string;
  title: string;
  createdAt: string;
  doingTodos: Array<DoingTodoDto>;
  completedTodos: Array<CompletedTodoDto>;
  tags: string[];
}

export interface AddTodoListErrorDto {
  title?: string;
}
