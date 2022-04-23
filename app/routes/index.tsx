import type { ActionFunction, LoaderFunction, MetaFunction } from "remix";
import type { HomePageDto, RemixAppContext } from "shared";

import { useLoaderData } from "remix";
import { links, TodoLists } from "web/components/TodoLists";

export const meta: MetaFunction = ({ data: homePage }) => ({
  title: `TLM | Your todo lists (${homePage.totalNumberOfDoingTodos})`,
  description: "Welcome to Todo List Manager!",
});

export { links };

export const loader: LoaderFunction = async (args): Promise<HomePageDto> =>
  (args.context as RemixAppContext).loaders.homePage.run(args);

export const action: ActionFunction = async (args) =>
  (args.context as RemixAppContext).actions.addTodoList.run(args);

export default function IndexPage() {
  const { todoLists } = useLoaderData<HomePageDto>();

  return <TodoLists todoLists={todoLists} />;
}
