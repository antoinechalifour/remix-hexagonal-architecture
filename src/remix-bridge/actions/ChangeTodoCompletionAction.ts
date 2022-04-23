import type { DataFunctionArgs } from "@remix-run/node";

import { redirect } from "remix";
import Joi from "joi";
import { TodoApplicationService } from "todo-list-manager";
import { requireAuthentication, validateBody } from "../http";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ChangeTodoCompletionAction {
  constructor(
    private readonly todoApplicationService: TodoApplicationService
  ) {}

  async run({ request, params }: DataFunctionArgs) {
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
}
