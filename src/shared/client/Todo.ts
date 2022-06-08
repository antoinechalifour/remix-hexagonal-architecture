export interface DoneTodos {
  id: string;
  title: string;
  isDone: true;
  createdAt: string;
  tags: string[];
}

export interface DoingTodoDto {
  id: string;
  title: string;
  isDone: false;
  createdAt: string;
  tags: string[];
}

export type TodoDto = DoneTodos | DoingTodoDto;

export interface AddTodoErrorDto {
  todoTitle?: string;
}
