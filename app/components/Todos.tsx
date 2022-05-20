import type { TodoDto, TodoListDto } from "shared";
import { moveArrayItem } from "../../src/shared/lib";

import React, { useEffect, useReducer, useState } from "react";
import classNames from "classnames";
import { TodoList } from "front/components/TodoList";
import { TodoItem } from "front/components/TodoItem";
import { ReorderableTodoItem } from "front/components/ReorderableTodoItem";
import { TodoListHeader } from "front/components/TodoListHeader";
import { TodoTag } from "front/components/TodoTag";
import { PlainButton } from "front/ui/Button";

interface TodosProps {
  todoList: TodoListDto;
}

interface TodoOrderPreview {
  todoId: string;
  newIndex: number;
}

export const Todos = ({ todoList }: TodosProps) => {
  const {
    doingTodos,
    completedTodos,
    filterTags,
    resetFilter,
    reorderForPreview,
    selectTag,
    unselectTag,
  } = useTodos(todoList);

  return (
    <section className="space-y-10">
      <TodoListHeader todoList={todoList} />

      <nav className="space-y-2">
        <p>
          Filter by tag <PlainButton onClick={resetFilter}>(clear)</PlainButton>
        </p>
        <ul className="flex w-full flex-wrap">
          {todoList.tags.map((tag) => {
            const active = filterTags.includes(tag);

            return (
              <li key={tag} className="p-1">
                <PlainButton
                  onClick={() => (active ? unselectTag(tag) : selectTag(tag))}
                  className={"cursor-pointer rounded"}
                >
                  <TodoTag
                    className={classNames({
                      "opacity-30": !active,
                    })}
                  >
                    {tag}
                  </TodoTag>
                </PlainButton>
              </li>
            );
          })}
        </ul>
      </nav>

      <TodoList
        title="Things to do"
        todos={doingTodos}
        emptyMessage="Come on! Don't you have anything to do?"
        renderTodo={(todoItem, index) => (
          <ReorderableTodoItem
            todoList={todoList}
            todo={todoItem}
            index={index}
            onPreviewMove={reorderForPreview}
          />
        )}
      />

      <TodoList
        title="Things done"
        todos={completedTodos}
        emptyMessage="Alright let's get to work!"
        renderTodo={(todoItem) => (
          <TodoItem todoList={todoList} todo={todoItem} />
        )}
      />
    </section>
  );
};

interface TodosState {
  selectedTags: string[];
  doingTodos: TodoDto[];
  completedTodos: TodoDto[];
}

function filterTagsInitialState(todoList: TodoListDto): TodosState {
  return {
    selectedTags: [],
    doingTodos: todoList.doingTodos,
    completedTodos: todoList.completedTodos,
  };
}

type SelectTagAction = {
  type: "SelectTag";
  tag: string;
};

type UnselectTagAction = {
  type: "UnselectTag";
  tag: string;
};

type ResetFilter = {
  type: "ResetFilter";
};

const createReducer =
  (todoList: TodoListDto) =>
  (
    state: TodosState,
    action: SelectTagAction | UnselectTagAction | ResetFilter
  ): TodosState => {
    let selectedTags: string[] = [];

    if (action.type === "SelectTag") {
      selectedTags = [...state.selectedTags, action.tag];
    }

    if (action.type === "UnselectTag") {
      selectedTags = state.selectedTags.filter((tag) => tag !== action.tag);
    }

    return {
      selectedTags: selectedTags,
      doingTodos: todoList.doingTodos.filter((todo) =>
        hasTagIn(todo, selectedTags)
      ),
      completedTodos: todoList.completedTodos.filter((todo) =>
        hasTagIn(todo, selectedTags)
      ),
    };
  };

function hasTagIn(todo: TodoDto, tags: string[]) {
  if (tags.length === 0) return true;
  return todo.tags.some((tag) => tags.includes(tag));
}

function useTodos(todoList: TodoListDto) {
  const [todoOrderPreview, setTodoOrderPreview] =
    useState<TodoOrderPreview | null>(null);
  const reorderForPreview = (todoId: string, newIndex: number) =>
    setTodoOrderPreview({ todoId, newIndex });
  const [state, dispatch] = useReducer(
    createReducer(todoList),
    filterTagsInitialState(todoList)
  );

  useEffect(() => {
    setTodoOrderPreview(null);
  }, [todoList]);

  const selectTag = (tag: string) =>
    dispatch({
      type: "SelectTag",
      tag,
    });

  const unselectTag = (tag: string) =>
    dispatch({
      type: "UnselectTag",
      tag,
    });

  const resetFilter = () => dispatch({ type: "ResetFilter" });

  return {
    doingTodos: sortDoingTodos(state.doingTodos, todoOrderPreview),
    completedTodos: state.completedTodos,
    filterTags: state.selectedTags,
    reorderForPreview,
    selectTag,
    unselectTag,
    resetFilter,
  };
}

function sortDoingTodos(
  todos: TodoDto[],
  orderPreview: TodoOrderPreview | null
) {
  if (orderPreview == null) return todos;

  const currentIndex = todos.findIndex(
    (todo) => todo.id === orderPreview.todoId
  );

  if (currentIndex === -1) return todos;
  return moveArrayItem(todos, currentIndex, orderPreview.newIndex);
}
