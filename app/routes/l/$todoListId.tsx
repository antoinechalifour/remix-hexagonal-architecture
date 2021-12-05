import type { ActionFunction, LoaderFunction } from "remix";
import type { TodoListId } from "~/domain/TodoList";
import type { TodoListReadModel } from "~/query/TodoListReadModel";

import { MetaFunction, useLoaderData } from "remix";
import { container } from "~/container";
import { requireAuthentication } from "~/application/remix/http";
import { AddTodoAction } from "~/application/actions/AddTodoAction";
import { links, Todos } from "~/application/components/Todos";
import { FetchTodoListPrismaQuery } from "~/infrastructure/queries/FetchTodoListPrismaQuery";

export const meta: MetaFunction = ({ data: todoList }) => ({
  title: `TLM | ${todoList?.title} (${todoList?.doingTodos.length})`,
  description: `Created by you on ${todoList?.createdAt}`,
});

export { links };

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<TodoListReadModel> => {
  await requireAuthentication(request);
  return container
    .build(FetchTodoListPrismaQuery)
    .run(params.todoListId as TodoListId);
};

export const action: ActionFunction = async (context) => {
  await requireAuthentication(context.request);
  return container.build(AddTodoAction).run(context);
};

export default function TodoListPage() {
  const todoList = useLoaderData<TodoListReadModel>();

  return <Todos todoList={todoList} />;
}
