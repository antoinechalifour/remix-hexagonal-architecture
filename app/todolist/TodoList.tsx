import React from "react";
import { Todos } from "front/todolist/Todos";
import { TodoItem } from "front/todolist/TodoItem";
import { ReorderableTodoItem } from "front/todolist/ReorderableTodoItem";
import { TodoListHeader } from "front/todolist/TodoListHeader";
import { TagFilters } from "front/todolist/TagFilters";
import { useTodosOrderPreview } from "front/todolist/useTodosOrderPreview";
import { TodosHeading } from "front/todolist/TodosHeading";
import { useFilter, useTodoList } from "front/todolist/state";

export const TodoList = () => {
  const {
    todoListInfo,
    doingTodos,
    completedTodos,
    doingTodosLabel,
    completedTodosLabel,
  } = useTodoList();
  const filter = useFilter();
  const { reorderForPreview, sortForPreview } = useTodosOrderPreview();

  return (
    <section className="space-y-10">
      <TodoListHeader />

      <TagFilters tags={todoListInfo.tags} />

      <Todos
        title={
          <TodosHeading title="Things to do" filterLabel={doingTodosLabel} />
        }
        todos={sortForPreview(doingTodos)}
        emptyMessage="Come on! Don't you have anything to do?"
        renderTodo={(todoItem, index) => (
          <ReorderableTodoItem
            enabled={!filter.active}
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
    </section>
  );
};
