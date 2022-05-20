import type { TodoDto, TodoListDto } from "shared";
import { moveArrayItem } from "../../src/shared/lib";

import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { Todos } from "front/todolist/Todos";
import { TodoItem } from "front/todolist/TodoItem";
import { ReorderableTodoItem } from "front/todolist/ReorderableTodoItem";
import { TodoListHeader } from "front/todolist/TodoListHeader";
import { TodoTag } from "front/todolist/TodoTag";
import { PlainButton } from "front/ui/Button";

interface TodoListProps {
  todoList: TodoListDto;
}

interface TodoOrderPreview {
  todoId: string;
  newIndex: number;
}

export const TodoList = ({ todoList }: TodoListProps) => {
  const {
    doingTodos,
    completedTodos,
    selectedTags,
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
            const active = selectedTags.includes(tag);

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

      <Todos
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

      <Todos
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

function hasTagIn(todo: TodoDto, tags: string[]) {
  if (tags.length === 0) return true;
  return todo.tags.some((tag) => tags.includes(tag));
}

function useTodos(todoList: TodoListDto) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [todoOrderPreview, setTodoOrderPreview] =
    useState<TodoOrderPreview | null>(null);
  const reorderForPreview = (todoId: string, newIndex: number) =>
    setTodoOrderPreview({ todoId, newIndex });

  useEffect(() => {
    setTodoOrderPreview(null);
    setSelectedTags([]);
  }, [todoList]);

  const selectTag = (tagToSelect: string) =>
    setSelectedTags((tags) => [...tags, tagToSelect]);
  const unselectTag = (tagToUnselect: string) =>
    setSelectedTags((tags) => tags.filter((tag) => tagToUnselect !== tag));
  const resetFilter = () => setSelectedTags([]);

  const doingTodos = todoList.doingTodos.filter((todo) =>
    hasTagIn(todo, selectedTags)
  );
  const completedTodos = todoList.completedTodos.filter((todo) =>
    hasTagIn(todo, selectedTags)
  );

  return {
    doingTodos: sortDoingTodos(doingTodos, todoOrderPreview),
    completedTodos,
    selectedTags,
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
