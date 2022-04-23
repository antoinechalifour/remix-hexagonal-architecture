import { Module } from "@nestjs/common";
import { RemixController } from "./RemixController";
import { AddTodoAction } from "./actions/AddTodoAction";
import { TodoListManagerModule } from "todo-list-manager";
import { AuthenticationModule } from "authentication";
import { ArchiveTodoAction } from "./actions/ArchiveTodoAction";
import { ChangeTodoCompletionAction } from "./actions/ChangeTodoCompletionAction";
import { AddTodoListAction } from "./actions/AddTodoListAction";
import { ArchiveTodoListAction } from "./actions/ArchiveTodoListAction";
import { LoginAction } from "./actions/LoginAction";
import { RemixNestContextLoader } from "./RemixNestContextLoader";
import { LoginPageLoader } from "./loaders/LoginPageLoader";
import { HomePageLoader } from "./loaders/HomePageLoader";
import { TodoListPageLoader } from "./loaders/TodoListPageLoader";

@Module({
  imports: [TodoListManagerModule, AuthenticationModule],
  controllers: [RemixController],
  providers: [
    RemixNestContextLoader,
    AddTodoAction,
    ArchiveTodoAction,
    ChangeTodoCompletionAction,
    AddTodoListAction,
    ArchiveTodoListAction,
    LoginAction,
    LoginPageLoader,
    HomePageLoader,
    TodoListPageLoader,
  ],
})
export class RemixModule {}
