import type { DoingTodoDto, TodoListDto } from "shared";
import { moveArrayItem } from "../../src/shared/lib";

import React, { useEffect, useMemo, useState } from "react";
import { TodoList } from "front/components/TodoList";
import { TodoItem } from "front/components/TodoItem";
import { ReorderableTodoItem } from "front/components/ReorderableTodoItem";
import { TodoListHeader } from "front/components/TodoListHeader";

interface TodosProps {
  todoList: TodoListDto;
}

interface TodoOrderPreview {
  todoId: string;
  newIndex: number;
}

export const Todos = ({ todoList }: TodosProps) => {
  const { moveForPreview, doingTodos } = useTodos(todoList);

  return (
    <section className="space-y-10">
      <TodoListHeader todoList={todoList} />

      <TodoList
        title="Things to do"
        todos={doingTodos}
        emptyMessage="Come on! Don't you have anything to do?"
        renderTodo={(todoItem, index) => (
          <ReorderableTodoItem
            todoList={todoList}
            todo={todoItem}
            index={index}
            onPreviewMove={moveForPreview}
          />
        )}
      />

      <TodoList
        title="Things done"
        todos={todoList.completedTodos}
        emptyMessage="Alright let's get to work!"
        renderTodo={(todoItem) => (
          <TodoItem todoList={todoList} todo={todoItem} />
        )}
      />
    </section>
  );
};

function useTodos(todoList: TodoListDto) {
  const [todoOrderPreview, setTodoOrderPreview] =
    useState<TodoOrderPreview | null>(null);
  const moveForPreview = (todoId: string, newIndex: number) =>
    setTodoOrderPreview({ todoId, newIndex });

  useEffect(() => {
    setTodoOrderPreview(null);
  }, [todoList]);

  const doingTodos = useMemo(
    () => sortDoingTodos(todoList.doingTodos, todoOrderPreview),
    [todoList.doingTodos, todoOrderPreview]
  );

  return { doingTodos, moveForPreview };
}

function sortDoingTodos(
  todos: DoingTodoDto[],
  orderPreview: TodoOrderPreview | null
) {
  if (orderPreview == null) return todos;

  const currentIndex = todos.findIndex(
    (todo) => todo.id === orderPreview.todoId
  );

  if (currentIndex === -1) return todos;
  return moveArrayItem(todos, currentIndex, orderPreview.newIndex);
}
