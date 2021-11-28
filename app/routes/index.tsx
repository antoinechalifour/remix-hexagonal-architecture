import type { ActionFunction, LoaderFunction, MetaFunction } from "remix";
import type { HomePageReadModel } from "~/query/HomePageReadModel";

import Joi from "joi";
import { redirect, useLoaderData } from "remix";
import { container } from "~/container";
import { links, TodoLists } from "~/application/components/TodoLists";
import { runAction } from "~/application/remix";
import { AddTodoList } from "~/domain/AddTodoList";
import { FetchHomePagePrismaQuery } from "~/infrastructure/queries/FetchHomePagePrismaQuery";

export const meta: MetaFunction = ({ data: homePage }) => ({
  title: `TLM | Your todo lists (${homePage.totalNumberOfDoingTodos})`,
  description: "Welcome to Todo List Manager!",
});

export { links };

export const loader: LoaderFunction = (): Promise<HomePageReadModel> =>
  container.build(FetchHomePagePrismaQuery).run();

const actionSchema = Joi.object({
  title: Joi.string().required().trim().max(60).messages({
    "string.empty": "The title of your todo list is required.",
    "string.required": "The title of your todo list is required.",
    "string.max": "The title of your todo list is limited to 60 characters.",
  }),
});

export const action: ActionFunction = async (context) =>
  runAction(context, actionSchema, async (payload) => {
    const url = await container
      .build(AddTodoList)
      .execute(payload.title as string);

    return redirect(url);
  });

export default function IndexPage() {
  const { todoLists } = useLoaderData<HomePageReadModel>();

  return <TodoLists todoLists={todoLists} />;
}
