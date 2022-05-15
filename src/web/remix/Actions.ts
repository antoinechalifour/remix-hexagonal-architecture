import { Inject, Injectable } from "@nestjs/common";
import { redirect } from "@remix-run/node";
import { Body, DataFunction, Params, SessionManager } from "remix-nest-adapter";
import { Authenticator, LoginApplicationService } from "authentication";
import {
  TodoApplicationService,
  TodoListApplicationService,
} from "todo-list-manager";
import { AUTHENTICATOR } from "../../keys";
import { Authenticated } from "../authenticator/Authenticated";
import { AddTodoBody, AddTodoParams } from "./dtos/AddTodo";
import { ArchiveTodoParams } from "./dtos/ArchiveTodo";
import {
  ChangeTodoCompletionBody,
  ChangeTodoCompletionParams,
} from "./dtos/ChangeTodoCompletion";
import { AddTodoListBody } from "./dtos/AddTodoList";
import { ArchiveTodoListParams } from "./dtos/ArchiveTodoList";
import { LoginBody } from "./dtos/Login";
import { ReorderTodosBody, ReorderTodosParams } from "./dtos/ReorderTodos";
import {
  RenameTodoListBody,
  RenameTodoListParams,
} from "./dtos/RenameTodoList";
import { RenameTodoBody, RenameTodoParams } from "./dtos/RenameTodo";

@Injectable()
export class Actions {
  constructor(
    @Inject(AUTHENTICATOR)
    private readonly authenticator: Authenticator,
    private readonly sessionManager: SessionManager,
    private readonly todoApplicationService: TodoApplicationService,
    private readonly todoListApplicationService: TodoListApplicationService,
    private readonly loginApplicationService: LoginApplicationService
  ) {}

  @DataFunction()
  async login(@Body() body: LoginBody) {
    const { url, cookie } = await this.loginApplicationService.login({
      email: body.email,
      password: body.password,
      registration: body.register != null,
    });
    return redirect(url, {
      headers: {
        "Set-Cookie": cookie,
      },
    });
  }

  @Authenticated()
  @DataFunction()
  async addTodo(@Params() params: AddTodoParams, @Body() body: AddTodoBody) {
    await this.todoApplicationService.add(
      params.todoListId,
      body.todoTitle,
      await this.authenticator.currentUser()
    );
    return null;
  }

  @Authenticated()
  @DataFunction()
  async archiveTodo(@Params() params: ArchiveTodoParams) {
    await this.todoApplicationService.archive(
      params.todoListId,
      params.todoId,
      await this.authenticator.currentUser()
    );
    return redirect(`/l/${params.todoListId}`);
  }

  @Authenticated()
  @DataFunction()
  async changeTodoCompletion(
    @Params() params: ChangeTodoCompletionParams,
    @Body() body: ChangeTodoCompletionBody
  ) {
    await this.todoApplicationService.changeTodoCompletion(
      params.todoListId,
      params.todoId,
      body.isChecked,
      await this.authenticator.currentUser()
    );
    return redirect(`/l/${params.todoListId}`);
  }

  @Authenticated()
  @DataFunction()
  async renameTodo(
    @Params() params: RenameTodoParams,
    @Body() body: RenameTodoBody
  ) {
    await this.todoApplicationService.renameTodo(
      params.todoListId,
      params.todoId,
      body.title,
      await this.authenticator.currentUser()
    );

    return null;
  }

  @Authenticated()
  @DataFunction()
  async addTodoList(@Body() body: AddTodoListBody) {
    const url = await this.todoListApplicationService.add(
      body.title,
      await this.authenticator.currentUser()
    );
    return redirect(url);
  }

  @Authenticated()
  @DataFunction()
  async renameTodoList(
    @Params() params: RenameTodoListParams,
    @Body() body: RenameTodoListBody
  ) {
    await this.todoListApplicationService.rename(
      params.todoListId,
      body.title,
      await this.authenticator.currentUser()
    );

    return null;
  }

  @Authenticated()
  @DataFunction()
  async archiveTodoList(@Params() params: ArchiveTodoListParams) {
    await this.todoListApplicationService.archive(
      params.todoListId,
      await this.authenticator.currentUser()
    );
    return redirect("/");
  }

  @Authenticated()
  @DataFunction()
  async reorderTodoList(
    @Params() params: ReorderTodosParams,
    @Body() body: ReorderTodosBody
  ) {
    await this.todoListApplicationService.reorder(
      params.todoListId,
      await this.authenticator.currentUser(),
      body.todoId,
      body.newIndex
    );

    return null;
  }
}
