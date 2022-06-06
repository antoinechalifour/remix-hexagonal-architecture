import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { TodoListDetailsDto, TodoListPageDto } from "shared/client";
import type { RemixAppContext } from "web";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { RecoilRoot } from "recoil";
import { TodoList } from "front/todolist/TodoList";
import { makeInitialState } from "front/todolist/state";

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
  const todoListPage = useLoaderData<TodoListPageDto>();

  return (
    <RecoilRoot initializeState={makeInitialState(todoListPage)}>
      <DndProvider backend={HTML5Backend}>
        <TodoList />
      </DndProvider>
    </RecoilRoot>
  );
}
