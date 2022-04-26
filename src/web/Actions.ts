import { Injectable } from "@nestjs/common";
import { redirect } from "@remix-run/node";
import { Session } from "remix";
import { LoginApplicationService } from "authentication";
import {
  TodoApplicationService,
  TodoListApplicationService,
} from "todo-list-manager";
import { Authenticated } from "./decorators";
import { AddTodoBody, AddTodoParams } from "./dtos/AddTodo";
import { ArchiveTodoParams } from "./dtos/ArchiveTodo";
import {
  ChangeTodoCompletionBody,
  ChangeTodoCompletionParams,
} from "./dtos/ChangeTodoCompletion";
import { AddTodoListBody } from "./dtos/AddTodoList";
import { ArchiveTodoListParams } from "./dtos/ArchiveTodoList";
import { LoginBody } from "./dtos/Login";
import { Body, Params } from "remix-nest-adapter";
import { DataFunction } from "../remix-nest-adapter/decorators/DataFunction";
import { CurrentSession } from "../remix-nest-adapter/decorators/CurrentSession";

@Injectable()
export class Actions {
  constructor(
    private readonly loginApplicationService: LoginApplicationService,
    private readonly todoApplicationService: TodoApplicationService,
    private readonly todoListApplicationService: TodoListApplicationService
  ) {}

  @DataFunction()
  async login(@Body() body: LoginBody, @CurrentSession() session: Session) {
    const [url, cookie] = await this.loginApplicationService.login(
      session,
      body.username,
      body.password
    );

    return redirect(url, {
      headers: { "Set-Cookie": cookie },
    });
  }

  @Authenticated()
  @DataFunction()
  async addTodo(@Params() params: AddTodoParams, @Body() body: AddTodoBody) {
    await this.todoApplicationService.add(params.todoListId, body.todoTitle);
    return null;
  }

  @Authenticated()
  @DataFunction()
  async archiveTodo(@Params() params: ArchiveTodoParams) {
    await this.todoApplicationService.archive(params.todoId);
    return redirect(`/l/${params.todoListId}`);
  }

  @Authenticated()
  @DataFunction()
  async changeTodoCompletion(
    @Params() params: ChangeTodoCompletionParams,
    @Body() body: ChangeTodoCompletionBody
  ) {
    await this.todoApplicationService.changeTodoCompletion(
      params.todoId,
      body.isChecked
    );
    return redirect(`/l/${params.todoListId}`);
  }

  @Authenticated()
  @DataFunction()
  async addTodoList(@Body() body: AddTodoListBody) {
    const url = await this.todoListApplicationService.add(body.title);
    return redirect(url);
  }

  @Authenticated()
  @DataFunction()
  async archiveTodoList(@Params() params: ArchiveTodoListParams) {
    await this.todoListApplicationService.archive(params.todoListId);
    return redirect("/");
  }
}
