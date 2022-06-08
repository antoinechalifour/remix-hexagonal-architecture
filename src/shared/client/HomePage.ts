export interface TodoListSummaryDto {
  id: string;
  title: string;
  createdAt: string;
  numberOfTodos: number;
}

export interface TodoListPermissionDto {
  permissions: {
    archive: boolean;
    leave: boolean;
  };
}

export type TodoListSummaryWithPermissionDto = TodoListSummaryDto &
  TodoListPermissionDto;

export interface HomePageDto {
  totalNumberOfDoingTodos: number;
  todoListsOwned: TodoListSummaryWithPermissionDto[];
  todoListsContributed: TodoListSummaryWithPermissionDto[];
}
