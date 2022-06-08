import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import type { HomePageDto } from "shared/client";
import type { RemixAppContext } from "web";

import { HomePage } from "front/homepage/HomePage";

export const meta: MetaFunction = ({ data: homePage }) => ({
  title: `Todos | Your todo lists (${homePage.totalNumberOfDoingTodos})`,
  description: "Welcome to Todo List Manager!",
});

export const loader: LoaderFunction = async (args): Promise<HomePageDto> =>
  (args.context as RemixAppContext).loaders.homePage(args);

export const action: ActionFunction = async (args) =>
  (args.context as RemixAppContext).actions.createTodoList(args);

export default HomePage;
