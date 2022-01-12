import type { DataFunctionArgs } from "@remix-run/server-runtime";
import type { TodoId } from "~/domain/Todo";

import { redirect } from "remix";
import Joi from "joi";
import { validateBody } from "~/application/remix/http";
import { ChangeTodoCompletion } from "~/domain/ChangeTodoCompletion";

interface ChangeTodoCompletionActionOptions {
  changeTodoCompletion: ChangeTodoCompletion;
}

export class ChangeTodoCompletionAction {
  private readonly changeTodoCompletion;

  constructor({ changeTodoCompletion }: ChangeTodoCompletionActionOptions) {
    this.changeTodoCompletion = changeTodoCompletion;
  }

  async run({ request, params }: DataFunctionArgs) {
    const [errors, payload] = await validateBody(
      Joi.object({
        isChecked: Joi.string().required().valid("on", "off"),
      }),
      request
    );

    if (errors) return { errors };

    await this.changeTodoCompletion.execute(
      params.todoId as TodoId,
      payload.isChecked as string
    );

    return redirect(`/l/${params.todoListId}`);
  }
}
