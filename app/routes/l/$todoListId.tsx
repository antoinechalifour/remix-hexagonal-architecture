import type { ActionFunction, LoaderFunction } from "remix";
import type { TodoListId } from "~/domain/TodoList";
import type { TodoListReadModel } from "~/query/TodoListReadModel";

import { MetaFunction, useLoaderData } from "remix";
import { container } from "~/container";
import { links, Todos } from "~/application/components/Todos";
import { AddTodoAction } from "~/application/actions/AddTodoAction";
import { FetchTodoListPrismaQuery } from "~/infrastructure/queries/FetchTodoListPrismaQuery";

export const meta: MetaFunction = ({ data: todoList }) => ({
  title: `TLM | ${todoList?.title} (${todoList?.doingTodos.length})`,
  description: `Created by you on ${todoList?.createdAt}`,
});

export { links };

export const loader: LoaderFunction = async ({
  params,
}): Promise<TodoListReadModel> =>
  container
    .build(FetchTodoListPrismaQuery)
    .run(params.todoListId as TodoListId);

export const action: ActionFunction = async (context) =>
  container.build(AddTodoAction).run(context);

export default function TodoListPage() {
  const todoList = useLoaderData<TodoListReadModel>();

  return <Todos todoList={todoList} />;
}
