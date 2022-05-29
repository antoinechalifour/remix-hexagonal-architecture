import type { ActionFunction, LoaderFunction, MetaFunction } from "remix";
import type { TodoListsSummaryDto } from "shared/client";
import type { RemixAppContext } from "web";

import { TodoLists } from "front/homepage/TodoLists";

export const meta: MetaFunction = ({ data: homePage }) => ({
  title: `Todos | Your todo lists (${homePage.totalNumberOfDoingTodos})`,
  description: "Welcome to Todo List Manager!",
});

export const loader: LoaderFunction = async (
  args
): Promise<TodoListsSummaryDto> =>
  (args.context as RemixAppContext).loaders.homePage(args);

export const action: ActionFunction = async (args) =>
  (args.context as RemixAppContext).actions.addTodoList(args);

export default TodoLists;
