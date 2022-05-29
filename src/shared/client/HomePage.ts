export interface TodoListSummaryDto {
  id: string;
  title: string;
  createdAt: string;
  numberOfTodos: number;
}

export interface TodoListsSummaryDto {
  totalNumberOfDoingTodos: number;
  todoLists: TodoListSummaryDto[];
}
