import type { MetaFunction, ActionFunction, LoaderFunction } from "remix";
import type { TodoListDetailsDto } from "shared/client";
import type { RemixAppContext } from "web";

import { useLoaderData } from "remix";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TodoList } from "front/todolist/TodoList";
import { useEffect } from "react";
import { useFetcher } from "@remix-run/react";

export const meta: MetaFunction = ({ data: todoList }) => ({
  title: `Todos | ${todoList?.title} (${todoList?.doingTodos.length})`,
  description: `Created by you on ${todoList?.createdAt}`,
});

export const loader: LoaderFunction = async (
  args
): Promise<TodoListDetailsDto> =>
  (args.context as RemixAppContext).loaders.todoList(args);

export const action: ActionFunction = async (args) =>
  (args.context as RemixAppContext).actions.addTodo(args);

export default function TodoListPage() {
  const { todoList } = useTodoListPage();

  return (
    <DndProvider backend={HTML5Backend}>
      <TodoList todoList={todoList} />
    </DndProvider>
  );
}

function useTodoListPage() {
  const loaderData = useLoaderData<TodoListDetailsDto>();
  const refresher = useFetcher<TodoListDetailsDto>();
  const todoList = refresher.data || loaderData;
  const load = refresher.load;

  useEffect(() => {
    const source = new EventSource(`/events/l/${todoList.id}`);

    source.addEventListener("update", () => {
      load(window.location.pathname);
    });

    return () => source.close();
  }, [load, todoList.id]);

  return { todoList };
}
