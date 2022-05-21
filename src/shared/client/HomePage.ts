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
