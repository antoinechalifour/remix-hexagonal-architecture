import { Inject, Injectable } from "@nestjs/common";
import { redirect } from "@remix-run/node";
import { Body, DataFunction, Params, SessionManager } from "remix-nest-adapter";
import {
  AuthenticationApplicationService,
  Authenticator,
} from "authentication";
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
import { TagTodoBody, TagTodoParams } from "./dtos/TagTodo";
import { UntagTodoBody, UntagTodoParams } from "./dtos/UntagTodo";
import { ForgotPasswordBody } from "./dtos/ForgotPassword";

@Injectable()
export class Actions {
  constructor(
    @Inject(AUTHENTICATOR)
    private readonly authenticator: Authenticator,
    private readonly sessionManager: SessionManager,
    private readonly authenticationApplicationService: AuthenticationApplicationService,
    private readonly todoApplicationService: TodoApplicationService,
    private readonly todoListApplicationService: TodoListApplicationService
  ) {}

  @DataFunction()
  async loginOrRegister(@Body() body: LoginBody) {
    if (body.register != null) return this.register(body);

    return this.login(body);
  }

  @DataFunction()
  async forgotPassword(@Body() body: ForgotPasswordBody) {
    this.authenticationApplicationService.forgotPassword(body.email);
    return null;
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
  async tagTodo(@Params() params: TagTodoParams, @Body() body: TagTodoBody) {
    await this.todoApplicationService.tagTogo(
      params.todoListId,
      params.todoId,
      body.tag,
      await this.authenticator.currentUser()
    );

    return null;
  }

  @Authenticated()
  @DataFunction()
  async untagTodo(
    @Params() params: UntagTodoParams,
    @Body() body: UntagTodoBody
  ) {
    await this.todoApplicationService.untagTogo(
      params.todoListId,
      params.todoId,
      body.tag,
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

  private async register({ email, password }: LoginBody) {
    const { url, cookie } =
      await this.authenticationApplicationService.register(email, password);

    return redirect(url, {
      headers: {
        "Set-Cookie": cookie,
      },
    });
  }

  private async login({ email, password }: LoginBody) {
    const { url, cookie } = await this.authenticationApplicationService.login(
      email,
      password
    );

    return redirect(url, {
      headers: {
        "Set-Cookie": cookie,
      },
    });
  }
}
