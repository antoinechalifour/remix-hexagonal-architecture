import React from "react";
import { Todos } from "front/todolist/TodoList/Todos";
import { TodoItem } from "front/todolist/TodoItem/TodoItem";
import { ReorderableTodoItem } from "front/todolist/TodoItem/ReorderableTodoItem";
import { TodoListHeader } from "front/todolist/TodoList/TodoListHeader";
import { TagFilters } from "front/todolist/TodoList/TagFilters";
import { useTodosOrderPreview } from "front/todolist/useTodosOrderPreview";
import { TodosHeading } from "front/todolist/TodoList/TodosHeading";
import {
  useFilter,
  useSyncLoaderData,
  useTodoListOutdated,
  useTodos,
} from "front/todolist/state";
import { TodoListOutdatedMessage } from "front/todolist/TodoListOutdatedMessage";

export const TodoList = () => {
  useSyncLoaderData();

  const { doingTodos, completedTodos, doingTodosLabel, completedTodosLabel } =
    useTodos();
  const { reorderForPreview, sortForPreview } = useTodosOrderPreview();
  const outdated = useTodoListOutdated();
  const filter = useFilter();

  return (
    <section className="space-y-10">
      <TodoListHeader />
      <TagFilters />

      <Todos
        title={
          <TodosHeading title="Things to do" filterLabel={doingTodosLabel} />
        }
        todos={sortForPreview(doingTodos)}
        emptyMessage="Come on! Don't you have anything to do?"
        renderTodo={(todoItem, index) => (
          <ReorderableTodoItem
            enabled={!filter.active && !outdated}
            todo={todoItem}
            index={index}
            onPreviewMove={reorderForPreview}
          />
        )}
      />

      <Todos
        title={
          <TodosHeading title="Things done" filterLabel={completedTodosLabel} />
        }
        todos={completedTodos}
        emptyMessage="Alright let's get to work!"
        renderTodo={(todoItem) => <TodoItem todo={todoItem} />}
      />

      <TodoListOutdatedMessage />
    </section>
  );
};
