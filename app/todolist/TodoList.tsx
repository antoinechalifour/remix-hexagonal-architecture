import type { TodoListDto } from "shared";

import React from "react";
import { Todos } from "front/todolist/Todos";
import { TodoItem } from "front/todolist/TodoItem";
import { ReorderableTodoItem } from "front/todolist/ReorderableTodoItem";
import { TodoListHeader } from "front/todolist/TodoListHeader";
import { TagFilters } from "front/todolist/TagFilters";
import { useTodosOrderPreview } from "front/todolist/useTodosOrderPreview";
import { useTodoListFilter } from "front/todolist/useTodoListFilter";
import { TodosHeading } from "front/todolist/TodosHeading";

interface TodoListProps {
  todoList: TodoListDto;
}

export const TodoList = ({ todoList }: TodoListProps) => {
  const {
    doingTodos,
    completedTodos,
    doingTodoFilterLabel,
    completedTodoFilterLabel,
    filter,
  } = useTodoListFilter(todoList);
  const { reorderForPreview, sortForPreview } = useTodosOrderPreview(todoList);

  return (
    <section className="space-y-10">
      <TodoListHeader todoList={todoList} />
      <TagFilters tags={todoList.tags} filter={filter} />

      <Todos
        title={
          <TodosHeading
            title="Things to do"
            filterLabel={doingTodoFilterLabel}
          />
        }
        todos={sortForPreview(doingTodos)}
        emptyMessage="Come on! Don't you have anything to do?"
        renderTodo={(todoItem, index) => (
          <ReorderableTodoItem
            enabled={!filter.isFiltered()}
            todoList={todoList}
            todo={todoItem}
            index={index}
            onPreviewMove={reorderForPreview}
          />
        )}
      />

      <Todos
        title={
          <TodosHeading
            title="Things done"
            filterLabel={completedTodoFilterLabel}
          />
        }
        todos={completedTodos}
        emptyMessage="Alright let's get to work!"
        renderTodo={(todoItem) => (
          <TodoItem todoList={todoList} todo={todoItem} />
        )}
      />
    </section>
  );
};
