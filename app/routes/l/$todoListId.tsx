import type { ActionFunction, LoaderFunction } from "remix";
import type { TodoListDto } from "shared";
import type { RemixAppContext } from "web";

import { MetaFunction, useLoaderData } from "remix";
import { Todos } from "front/components/Todos";

export const meta: MetaFunction = ({ data: todoList }) => ({
  title: `TLM | ${todoList?.title} (${todoList?.doingTodos.length})`,
  description: `Created by you on ${todoList?.createdAt}`,
});

export const loader: LoaderFunction = async (args): Promise<TodoListDto> =>
  (args.context as RemixAppContext).loaders.todoList(args);

export const action: ActionFunction = async (args) =>
  (args.context as RemixAppContext).actions.addTodo(args);

export default function TodoListPage() {
  const todoList = useLoaderData<TodoListDto>();

  return <Todos todoList={todoList} />;
}
