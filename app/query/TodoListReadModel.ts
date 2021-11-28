export interface CompletedTodoReadModel {
  id: string;
  title: string;
  isComplete: true;
  createdAt: string;
}

export interface DoingTodoReadModel {
  id: string;
  title: string;
  isComplete: false;
  createdAt: string;
}

export type TodoReadModel = CompletedTodoReadModel | DoingTodoReadModel;

export interface TodoListReadModel {
  id: string;
  title: string;
  createdAt: string;
  doingTodos: Array<DoingTodoReadModel>;
  completedTodos: Array<CompletedTodoReadModel>;
}
