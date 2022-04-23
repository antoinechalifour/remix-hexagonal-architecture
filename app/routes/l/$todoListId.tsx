import type { ActionFunction, LoaderFunction } from "remix";
import type { TodoListDto, RemixAppContext } from "shared";

import { MetaFunction, useLoaderData } from "remix";
import { links, Todos } from "web/components/Todos";

export const meta: MetaFunction = ({ data: todoList }) => ({
  title: `TLM | ${todoList?.title} (${todoList?.doingTodos.length})`,
  description: `Created by you on ${todoList?.createdAt}`,
});

export { links };

export const loader: LoaderFunction = async (args): Promise<TodoListDto> =>
  (args.context as RemixAppContext).loaders.todoListPage.run(args);

export const action: ActionFunction = async (args) =>
  (args.context as RemixAppContext).actions.addTodo.run(args);

export default function TodoListPage() {
  const todoList = useLoaderData<TodoListDto>();

  return <Todos todoList={todoList} />;
}
