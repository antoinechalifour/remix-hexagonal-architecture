import type { DataFunctionArgs } from "@remix-run/server-runtime";

import { redirect } from "remix";
import Joi from "joi";
import { validateBody } from "~/application/remix/http";
import { AddTodoList } from "~/domain/AddTodoList";

interface AddTodoListActionOptions {
  addTodoList: AddTodoList;
}

const schema = Joi.object({
  title: Joi.string().required().trim().max(60).messages({
    "string.empty": "The title of your todo list is required.",
    "string.required": "The title of your todo list is required.",
    "string.max": "The title of your todo list is limited to 60 characters.",
  }),
});

export class AddTodoListAction {
  private readonly addTodoList;

  constructor({ addTodoList }: AddTodoListActionOptions) {
    this.addTodoList = addTodoList;
  }

  async run({ request }: DataFunctionArgs) {
    const [errors, payload] = await validateBody(schema, request);

    if (errors) return { errors };

    const url = await this.addTodoList.execute(payload.title as string);

    return redirect(url);
  }
}
