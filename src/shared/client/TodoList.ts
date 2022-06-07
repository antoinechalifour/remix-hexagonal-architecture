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
  role: "owner" | "collaborator";
}

export interface TodoListPageDto {
  isOwner: boolean;
  todoList: TodoListDetailsDto;
  completion: number;
  collaborators: TodoListCollaboratorDto[];
}

export interface AddTodoListErrorDto {
  title?: string;
}
