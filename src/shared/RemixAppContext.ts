import type {
  AddTodoAction,
  ArchiveTodoAction,
  ChangeTodoCompletionAction,
  AddTodoListAction,
  ArchiveTodoListAction,
  LoginAction,
  LoginPageLoader,
  HomePageLoader,
  TodoListPageLoader,
} from "remix-bridge";

export type RemixAppContext = {
  actions: {
    addTodo: AddTodoAction;
    archiveTodo: ArchiveTodoAction;
    changeTodoCompletion: ChangeTodoCompletionAction;
    addTodoList: AddTodoListAction;
    archiveTodoList: ArchiveTodoListAction;
    login: LoginAction;
  };
  loaders: {
    loginPage: LoginPageLoader;
    homePage: HomePageLoader;
    todoListPage: TodoListPageLoader;
  };
};
