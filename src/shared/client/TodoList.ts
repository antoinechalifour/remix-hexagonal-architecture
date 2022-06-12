import type { DoneTodos, DoingTodoDto } from "./Todo";

export interface TodoListDetailsDto {
  id: string;
  version: string;
  title: string;
  createdAt: string;
  doingTodos: DoingTodoDto[];
  doneTodos: DoneTodos[];
  tags: string[];
}

export interface TodoListContributorDto {
  id: string;
  email: string;
  shortName: string;
  role: "owner" | "contributor";
}

export interface TodoListPageDto {
  isOwner: boolean;
  todoList: TodoListDetailsDto;
  completion: number;
  contributors: TodoListContributorDto[];
}

export interface AddTodoListErrorDto {
  title?: string;
}
