import type { DataFunctionArgs } from "@remix-run/server-runtime";
import type { TodoListId } from "~/domain/TodoList";

import Joi from "joi";
import { validateBody } from "~/application/remix/http";
import { AddTodo } from "~/domain/AddTodo";

interface AddTodoActionOptions {
  addTodo: AddTodo;
}

export class AddTodoAction {
  private readonly addTodo;

  constructor({ addTodo }: AddTodoActionOptions) {
    this.addTodo = addTodo;
  }

  async run({ request, params }: DataFunctionArgs) {
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

    await this.addTodo.execute(
      params.todoListId as TodoListId,
      payload.todoTitle as string
    );

    return null;
  }
}
