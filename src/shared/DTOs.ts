// -------------------------------------
// Todos
// -------------------------------------
export interface AddTodoErrorDto {
  todoTitle?: string;
}

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

// -------------------------------------
// Todo-Lists
// -------------------------------------
export interface TodoListDto {
  id: string;
  title: string;
  createdAt: string;
  doingTodos: Array<DoingTodoDto>;
  completedTodos: Array<CompletedTodoDto>;
}

export interface AddTodoListErrorDto {
  title?: string;
}

// -------------------------------------
// Home Page
// -------------------------------------

export interface HomePageTodoListDto {
  id: string;
  title: string;
  createdAt: string;
  numberOfTodos: number;
}

export interface HomePageDto {
  totalNumberOfDoingTodos: number;
  todoLists: HomePageTodoListDto[];
}
// -------------------------------------
// Authentication
// -------------------------------------

export type AuthenticationErrorDto = {
  error: string | null;
};
