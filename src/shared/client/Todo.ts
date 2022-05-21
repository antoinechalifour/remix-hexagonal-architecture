export interface CompletedTodoDto {
  id: string;
  title: string;
  isComplete: true;
  createdAt: string;
  tags: string[];
}

export interface DoingTodoDto {
  id: string;
  title: string;
  isComplete: false;
  createdAt: string;
  tags: string[];
}

export type TodoDto = CompletedTodoDto | DoingTodoDto;

export interface AddTodoErrorDto {
  todoTitle?: string;
}
