import type { DataFunctionArgs } from "@remix-run/node";

import { redirect } from "remix";
import Joi from "joi";
import {
  TodoApplicationService,
  TodoListApplicationService,
} from "todo-list-manager";
import { requireAuthentication, validateBody } from "../http";
import { Injectable } from "@nestjs/common";

const schema = Joi.object({
  title: Joi.string().required().trim().max(60).messages({
    "string.empty": "The title of your todo list is required.",
    "string.required": "The title of your todo list is required.",
    "string.max": "The title of your todo list is limited to 60 characters.",
  }),
});

@Injectable()
export class AddTodoListAction {
  constructor(
    private readonly todoListApplicationService: TodoListApplicationService
  ) {}

  async run({ request }: DataFunctionArgs) {
    await requireAuthentication(request);
    const [errors, payload] = await validateBody(schema, request);

    if (errors) return { errors };

    const url = await this.todoListApplicationService.add(
      payload.title as string
    );

    return redirect(url);
  }
}
