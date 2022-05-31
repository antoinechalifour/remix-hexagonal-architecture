import type { MetaFunction, ActionFunction, LoaderFunction } from "remix";
import type { TodoListDetailsDto, TodoListPageDto } from "shared/client";
import type { RemixAppContext } from "web";

import { useLoaderData } from "remix";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TodoList } from "front/todolist/TodoList";
import { useEffect } from "react";
import { useFetcher } from "@remix-run/react";

export const meta: MetaFunction = ({ data }) => ({
  title: `Todos | ${data?.todoList.title} (${data?.todoList.doingTodos.length})`,
  description: `Created by you on ${data?.todoList.createdAt}`,
});

export const loader: LoaderFunction = async (
  args
): Promise<TodoListDetailsDto> =>
  (args.context as RemixAppContext).loaders.todoList(args);

export const action: ActionFunction = async (args) =>
  (args.context as RemixAppContext).actions.addTodo(args);

export default function TodoListPage() {
  const todoListPage = useTodoListPage();

  return (
    <DndProvider backend={HTML5Backend}>
      <TodoList todoListPage={todoListPage} />
    </DndProvider>
  );
}

function useTodoListPage() {
  const loaderData = useLoaderData<TodoListPageDto>();
  const refresher = useFetcher<TodoListPageDto>();
  const todoListPage = refresher.data || loaderData;
  const load = refresher.load;

  useEffect(() => {
    const source = new EventSource(`/events/l/${todoListPage.todoList.id}`);

    source.addEventListener("update", () => load(window.location.pathname));

    return () => source.close();
  }, [load, todoListPage.todoList.id]);

  return todoListPage;
}
