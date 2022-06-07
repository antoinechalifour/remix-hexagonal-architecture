import { Inject, Injectable } from "@nestjs/common";
import { redirect } from "@remix-run/node";
import {
  AuthenticationApplicationService,
  Authenticator,
  InvalidPasswordResetTokenError,
  PasswordResetTokenExpiredError,
} from "authentication";
import {
  ContributorNotFoundError,
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
import { DeleteTodoFromTodoListParams } from "./dtos/DeleteTodoFromTodoList";
import { MarkTodoBody, MarkTodoParams } from "./dtos/MarkTodo";
import { CreateTodoListBody } from "./dtos/CreateTodoList";
import { ArchiveTodoListParams } from "./dtos/ArchiveTodoList";
import { LoginBody } from "./dtos/Login";
import { ReorderTodoBody, ReorderTodoParams } from "./dtos/ReorderTodo";
import {
  UpdateTodoListTitleBody,
  UpdateTodoListTitleParams,
} from "./dtos/UpdateTodoListTitle";
import {
  UpdateTodoTitleBody,
  UpdateTodoTitleParams,
} from "./dtos/UpdateTodoTitle";
import { AddTagToTodoBody, AddTagToTodoParams } from "./dtos/AddTagToTodo";
import {
  RemoveTagFromTodoBody,
  RemoveTagFromTodoParams,
} from "./dtos/RemoveTagFromTodo";
import { ForgotPasswordBody } from "./dtos/ForgotPassword";
import { ResetPasswordBody } from "./dtos/ResetPassword";
import { RegisterBody } from "./dtos/Register";
import { GrantAccessBody, GrantAccessParams } from "./dtos/GrantAccess";
import { MapErrorReturning, MapErrorThrowing } from "./decorators/MapError";
import { RevokeAccessBody, RevokeAccessParams } from "./dtos/RevokeAccess";

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
    await this.authenticationApplicationService.forgotPassword(body.email);
    return null;
  }

  @DataFunction()
  @MapErrorThrowing([
    [
      InvalidPasswordResetTokenError,
      {
        status: 400,
        message:
          "Invalid password reset code. Have you copied the link correctly?",
      },
    ],
    [
      PasswordResetTokenExpiredError,
      {
        status: 400,
        message:
          'The reset code has expired. Please ask a new one by using the "Forgot your password" page.',
      },
    ],
  ])
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
  async addTodoToTodoList(
    @Params() params: AddTodoParams,
    @Body() body: AddTodoBody
  ) {
    await this.todoApplicationService.addTodoToTodoList(
      params.todoListId,
      body.todoTitle,
      await this.authenticator.currentUser()
    );
    return null;
  }

  @Authenticated()
  @DataFunction()
  async deleteTodoFromTodoList(@Params() params: DeleteTodoFromTodoListParams) {
    await this.todoApplicationService.deleteFromTodoList(
      params.todoListId,
      params.todoId,
      await this.authenticator.currentUser()
    );
    return null;
  }

  @Authenticated()
  @DataFunction()
  async markTodo(@Params() params: MarkTodoParams, @Body() body: MarkTodoBody) {
    await this.todoApplicationService.markTodo(
      params.todoListId,
      params.todoId,
      body.isChecked,
      await this.authenticator.currentUser()
    );
    return null;
  }

  @Authenticated()
  @DataFunction()
  async updateTodoTitle(
    @Params() params: UpdateTodoTitleParams,
    @Body() body: UpdateTodoTitleBody
  ) {
    await this.todoApplicationService.updateTodoTitle(
      params.todoListId,
      params.todoId,
      body.title,
      await this.authenticator.currentUser()
    );

    return null;
  }

  @Authenticated()
  @DataFunction()
  async addTagToTodo(
    @Params() params: AddTagToTodoParams,
    @Body() body: AddTagToTodoBody
  ) {
    await this.todoApplicationService.addTagToTodo(
      params.todoListId,
      params.todoId,
      body.tag,
      await this.authenticator.currentUser()
    );

    return null;
  }

  @Authenticated()
  @DataFunction()
  async removeTagFromTodo(
    @Params() params: RemoveTagFromTodoParams,
    @Body() body: RemoveTagFromTodoBody
  ) {
    await this.todoApplicationService.removeTagFromTodo(
      params.todoListId,
      params.todoId,
      body.tag,
      await this.authenticator.currentUser()
    );

    return null;
  }

  @Authenticated()
  @DataFunction()
  async createTodoList(@Body() body: CreateTodoListBody) {
    const todoListId = await this.todoListApplicationService.createTodoList(
      body.title,
      await this.authenticator.currentUser()
    );

    return redirect(`/l/${todoListId}`);
  }

  @Authenticated()
  @DataFunction()
  async updateTodoListTitle(
    @Params() params: UpdateTodoListTitleParams,
    @Body() body: UpdateTodoListTitleBody
  ) {
    await this.todoListApplicationService.updateTodoListTitle(
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
  async reorderTodo(
    @Params() params: ReorderTodoParams,
    @Body() body: ReorderTodoBody
  ) {
    await this.todoListApplicationService.reorderTodo(
      params.todoListId,
      await this.authenticator.currentUser(),
      body.todoId,
      body.newIndex
    );

    return null;
  }

  @Authenticated()
  @DataFunction()
  @MapErrorReturning([[ContributorNotFoundError, { status: 404 }]])
  async grantAccess(
    @Params() params: GrantAccessParams,
    @Body() body: GrantAccessBody
  ) {
    await this.todoListApplicationService.grantAccess(
      params.todoListId,
      body.email,
      await this.authenticator.currentUser()
    );

    return null;
  }

  @Authenticated()
  @DataFunction()
  async revokeAccess(
    @Params() params: RevokeAccessParams,
    @Body() body: RevokeAccessBody
  ) {
    await this.todoListApplicationService.revokeAccess(
      params.todoListId,
      body.contributorId,
      await this.authenticator.currentUser()
    );

    return null;
  }
}
