import type { CompletedTodoDto, DoingTodoDto } from "./Todo";

export interface TodoListDetailsDto {
  id: string;
  title: string;
  createdAt: string;
  doingTodos: Array<DoingTodoDto>;
  completedTodos: Array<CompletedTodoDto>;
  tags: string[];
}

export interface TodoListCollaboratorDto {
  id: string;
  email: string;
  shortName: string;
}

export interface TodoListPageDto {
  todoListDetails: TodoListDetailsDto;
  collaborators: TodoListCollaboratorDto[];
}

export interface AddTodoListErrorDto {
  title?: string;
}
