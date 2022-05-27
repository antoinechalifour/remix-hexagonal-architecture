import { Inject, Injectable } from "@nestjs/common";
import { redirect } from "@remix-run/node";
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
import { DataFunction } from "./decorators/DataFunction";
import { Body } from "./decorators/Body";
import { Params } from "./decorators/Params";
import { SessionManager } from "../authenticator/SessionManager";
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
import { ResetPasswordBody } from "./dtos/ResetPassword";
import { RegisterBody } from "./dtos/Register";
import { ShareTodoListBody, ShareTodoListParams } from "./dtos/ShareTodoList";

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
  async login(@Body() body: LoginBody) {
    const session = await this.sessionManager.get();
    const [err, sessionData] =
      await this.authenticationApplicationService.login(
        body.email,
        body.password
      );

    let url: string;
    if (err) {
      url = "/login";
      session.flash("error", err.message);
    } else {
      url = "/";

      session.set("userId", sessionData.userId);
      session.set("sessionId", sessionData.id);
    }

    return redirect(url, {
      headers: {
        "Set-Cookie": await this.sessionManager.commit(session),
      },
    });
  }

  @DataFunction()
  async register(@Body() body: RegisterBody) {
    const session = await this.sessionManager.get();
    const err = await this.authenticationApplicationService.register(
      body.email,
      body.password
    );

    let url: string;
    if (err) {
      session.flash("error", err.message);
      url = "/register";
    } else {
      url = "/welcome";
    }

    return redirect(url, {
      headers: {
        "Set-Cookie": await this.sessionManager.commit(session),
      },
    });
  }

  @DataFunction()
  async forgotPassword(@Body() body: ForgotPasswordBody) {
    this.authenticationApplicationService.forgotPassword(body.email);
    return null;
  }

  @DataFunction()
  async resetPassword(@Body() body: ResetPasswordBody) {
    await this.authenticationApplicationService.resetPassword(
      body.email,
      body.token,
      body.password
    );

    return redirect("/login");
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

  @Authenticated()
  @DataFunction()
  async shareTodoList(
    @Params() params: ShareTodoListParams,
    @Body() body: ShareTodoListBody
  ) {
    await this.todoListApplicationService.share(
      params.todoListId,
      body.email,
      await this.authenticator.currentUser()
    );

    return null;
  }
}
