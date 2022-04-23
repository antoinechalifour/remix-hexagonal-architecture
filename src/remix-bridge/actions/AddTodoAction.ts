import type { DataFunctionArgs } from "@remix-run/node";

import Joi from "joi";
import { Injectable } from "@nestjs/common";
import { TodoApplicationService } from "todo-list-manager";
import { requireAuthentication, validateBody } from "../http";

@Injectable()
export class AddTodoAction {
  constructor(
    private readonly todoApplicationService: TodoApplicationService
  ) {}

  async run({ request, params }: DataFunctionArgs) {
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
}
