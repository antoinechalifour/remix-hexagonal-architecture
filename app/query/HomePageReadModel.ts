export interface HomePageTodoListReadModel {
  id: string;
  title: string;
  createdAt: string;
  numberOfTodos: number;
}

export interface HomePageReadModel {
  totalNumberOfDoingTodos: number;
  todoLists: Array<HomePageTodoListReadModel>;
}
