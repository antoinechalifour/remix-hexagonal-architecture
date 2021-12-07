import type { ActionFunction, LoaderFunction, MetaFunction } from "remix";
import type { HomePageReadModel } from "~/query/HomePageReadModel";

import { useLoaderData } from "remix";
import { container } from "~/container";
import { AddTodoListAction } from "~/application/actions/AddTodoListAction";
import { links, TodoLists } from "~/application/components/TodoLists";
import { FetchHomePagePrismaQuery } from "~/infrastructure/queries/FetchHomePagePrismaQuery";

export const meta: MetaFunction = ({ data: homePage }) => ({
  title: `TLM | Your todo lists (${homePage.totalNumberOfDoingTodos})`,
  description: "Welcome to Todo List Manager!",
});

export { links };

export const loader: LoaderFunction = (): Promise<HomePageReadModel> =>
  container.build(FetchHomePagePrismaQuery).run();

export const action: ActionFunction = async (context) =>
  container.build(AddTodoListAction).run(context);

export default function IndexPage() {
  const { todoLists } = useLoaderData<HomePageReadModel>();

  return <TodoLists todoLists={todoLists} />;
}
