export interface TodoListSummaryDto {
  id: string;
  title: string;
  createdAt: string;
  numberOfTodos: number;
}

export interface HomePageDto {
  totalNumberOfDoingTodos: number;
  todoListsOwned: TodoListSummaryDto[];
  todoListsContributed: TodoListSummaryDto[];
}
