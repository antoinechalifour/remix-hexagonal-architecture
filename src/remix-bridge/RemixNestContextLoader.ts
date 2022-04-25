import { Injectable } from "@nestjs/common";
import { AddTodoAction } from "./actions/AddTodoAction";
import { AddTodoListAction } from "./actions/AddTodoListAction";
import { ArchiveTodoAction } from "./actions/ArchiveTodoAction";
import { ArchiveTodoListAction } from "./actions/ArchiveTodoListAction";
import { ChangeTodoCompletionAction } from "./actions/ChangeTodoCompletionAction";
import { LoginAction } from "./actions/LoginAction";
import { LoginPageLoader } from "./loaders/LoginPageLoader";
import { HomePageLoader } from "./loaders/HomePageLoader";
import { TodoListPageLoader } from "./loaders/TodoListPageLoader";

@Injectable()
export class RemixNestContextLoader {
  constructor(
    private readonly addTodoList: AddTodoListAction,
    private readonly archiveTodoList: ArchiveTodoListAction,
    private readonly addTodo: AddTodoAction,
    private readonly archiveTodo: ArchiveTodoAction,
    private readonly changeTodoCompletion: ChangeTodoCompletionAction,
    private readonly login: LoginAction,
    private readonly loginPage: LoginPageLoader,
    private readonly homePageLoader: HomePageLoader,
    private readonly todoListPageLoader: TodoListPageLoader
  ) {}

  loadContext() {
    return {
      actions: {
        addTodo: this.addTodo,
        archiveTodo: this.archiveTodo,
        changeTodoCompletion: this.changeTodoCompletion,
        addTodoList: this.addTodoList,
        archiveTodoList: this.archiveTodoList,
        login: this.login,
      },
      loaders: {
        loginPage: this.loginPage,
        homePage: this.homePageLoader,
        todoListPage: this.todoListPageLoader,
      },
    };
  }
}

export type RemixAppContext = Awaited<
  ReturnType<RemixNestContextLoader["loadContext"]>
>;
