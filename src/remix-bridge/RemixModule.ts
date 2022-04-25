import { DynamicModule, Module } from "@nestjs/common";
import { RemixController } from "./RemixController";
import { RemixNestContextLoader } from "./RemixNestContextLoader";
import { LoginPageLoader } from "./loaders/LoginPageLoader";
import { HomePageLoader } from "./loaders/HomePageLoader";
import { TodoListPageLoader } from "./loaders/TodoListPageLoader";
import { TodoListManagerModule } from "todo-list-manager";
import { AuthenticationModule } from "authentication";
import { ArchiveTodoListAction } from "./actions/ArchiveTodoListAction";
import { AddTodoListAction } from "./actions/AddTodoListAction";
import { ArchiveTodoAction } from "./actions/ArchiveTodoAction";
import { AddTodoAction } from "./actions/AddTodoAction";
import { LoginAction } from "./actions/LoginAction";
import { RemixNestConfiguration } from "./RemixNestConfiguration";
import { ChangeTodoCompletionAction } from "./actions/ChangeTodoCompletionAction";

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
export class RemixModule {
  static forRoot(options: RemixNestConfiguration): DynamicModule {
    return {
      module: RemixModule,
      providers: [{ provide: "options", useValue: options }],
    };
  }
}
