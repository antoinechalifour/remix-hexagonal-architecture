import { Injectable } from "@nestjs/common";
import { DataFunctionArgs } from "@remix-run/node";
import { redirect } from "remix";
import Joi from "joi";
import { LoginApplicationService } from "authentication";
import {
  TodoApplicationService,
  TodoListApplicationService,
} from "todo-list-manager";
import { commitSession, getSession } from "./sessions";
import { header, requireAuthentication, validateBody } from "./http";

@Injectable()
export class Actions {
  constructor(
    private readonly loginApplicationService: LoginApplicationService,
    private readonly todoApplicationService: TodoApplicationService,
    private readonly todoListApplicationService: TodoListApplicationService
  ) {}

  async login({ request }: DataFunctionArgs) {
    const session = await getSession(header("Cookie", request));
    const [errors, payload] = await validateBody(
      Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
      }),
      request
    );

    if (errors) return { errors };

    const [error, userId] = await this.loginApplicationService.login(
      payload.username,
      payload.password
    );

    let url;

    if (error) {
      session.flash("error", error.message);
      url = "/login";
    } else {
      session.set("userId", userId);
      url = "/";
    }

    return redirect(url, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  async addTodo({ request, params }: DataFunctionArgs) {
    await requireAuthentication(request);
    const [errors, payload] = await validateBody(
      Joi.object({
        todoTitle: Joi.string().required().trim().max(50).messages({
          "string.required": "The title of your todo is required.",
          "string.empty": "The title of your todo is required.",
          "string.max": "The title of your todo is limited to 50 characters.",
        }),
      }),
      request
    );

    if (errors) return { errors };

    await this.todoApplicationService.add(
      params.todoListId as string,
      payload.todoTitle as string
    );

    return null;
  }

  async archiveTodo({ request, params }: DataFunctionArgs) {
    await requireAuthentication(request);
    await this.todoApplicationService.archive(params.todoId as string);

    return redirect(`/l/${params.todoListId}`);
  }

  async changeTodoCompletion({ request, params }: DataFunctionArgs) {
    await requireAuthentication(request);
    const [errors, payload] = await validateBody(
      Joi.object({
        isChecked: Joi.string().required().valid("on", "off"),
      }),
      request
    );

    if (errors) return { errors };

    await this.todoApplicationService.changeTodoCompletion(
      params.todoId as string,
      payload.isChecked as string
    );

    return redirect(`/l/${params.todoListId}`);
  }

  async addTodoList({ request }: DataFunctionArgs) {
    await requireAuthentication(request);
    const [errors, payload] = await validateBody(
      Joi.object({
        title: Joi.string().required().trim().max(60).messages({
          "string.empty": "The title of your todo list is required.",
          "string.required": "The title of your todo list is required.",
          "string.max":
            "The title of your todo list is limited to 60 characters.",
        }),
      }),
      request
    );

    if (errors) return { errors };

    const url = await this.todoListApplicationService.add(
      payload.title as string
    );

    return redirect(url);
  }

  async archiveTodoList({ request, params }: DataFunctionArgs) {
    await requireAuthentication(request);
    await this.todoListApplicationService.archive(params.todoListId as string);

    return redirect("/");
  }
}
