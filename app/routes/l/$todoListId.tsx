import type { ActionFunction, LoaderFunction } from "remix";
import type { TodoListId } from "~/domain/TodoList";
import type { TodoListReadModel } from "~/query/TodoListReadModel";

import Joi from "joi";
import { MetaFunction, useLoaderData } from "remix";
import { container } from "~/container";
import { Todos, links } from "~/application/components/Todos";
import { runAction } from "~/application/remix";
import { AddTodo } from "~/domain/AddTodo";
import { FetchTodoListPrismaQuery } from "~/infrastructure/queries/FetchTodoListPrismaQuery";

export const meta: MetaFunction = ({ data: todoList }) => ({
  title: `TLM | ${todoList.title} (${todoList.doingTodos.length})`,
  description: `Created by you on ${todoList.createdAt}`,
});

export { links };

export const loader: LoaderFunction = async ({
  params,
}): Promise<TodoListReadModel> =>
  container
    .build(FetchTodoListPrismaQuery)
    .run(params.todoListId as TodoListId);

const actionSchema = Joi.object({
  todoTitle: Joi.string().required().trim().max(50).messages({
    "string.required": "The title of your todo is required.",
    "string.empty": "The title of your todo is required.",
    "string.max": "The title of your todo is limited to 50 characters.",
  }),
});

export const action: ActionFunction = async (context) =>
  runAction(context, actionSchema, async (payload) => {
    await container
      .build(AddTodo)
      .execute(
        context.params.todoListId as TodoListId,
        payload.todoTitle as string
      );

    return null;
  });

export default function TodoListPage() {
  const todoList = useLoaderData<TodoListReadModel>();

  return <Todos todoList={todoList} />;
}
