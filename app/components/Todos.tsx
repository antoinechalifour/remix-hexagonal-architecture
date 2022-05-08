import type { DoingTodoDto, TodoListDto } from "shared";
import { moveArrayItem } from "../../src/shared/lib";

import React, { useEffect, useState } from "react";
import { displayDate } from "../Date";
import { PageTitle } from "../ui/PageTitle";
import { AddTodoForm } from "./AddTodoForm";
import { TodoList } from "./TodoList";
import { TodoItem } from "./TodoItem";
import { ReorderableTodoItem } from "./ReorderableTodoItem";

interface TodosProps {
  todoList: TodoListDto;
}

interface TodoOrderPreview {
  todoId: string;
  newIndex: number;
}

const sortDoingTodos = (
  todos: DoingTodoDto[],
  orderPreview: TodoOrderPreview | null
) => {
  if (orderPreview == null) return todos;

  const currentIndex = todos.findIndex(
    (todo) => todo.id === orderPreview.todoId
  );

  if (currentIndex === -1) return todos;
  return moveArrayItem(todos, currentIndex, orderPreview.newIndex);
};

export const Todos = ({ todoList }: TodosProps) => {
  const [todoOrderPreview, setTodoOrderPreview] =
    useState<TodoOrderPreview | null>(null);
  const moveForPreview = (todoId: string, newIndex: number) =>
    setTodoOrderPreview({ todoId, newIndex });

  useEffect(() => {
    setTodoOrderPreview(null);
  }, [todoList]);

  return (
    <section className="space-y-10">
      <div className="space-y-4">
        <PageTitle>{todoList.title}</PageTitle>

        <p className="pl-3 text-xs">
          ↳ You created this list {displayDate(todoList.createdAt)}
        </p>

        <AddTodoForm
          todoListId={todoList.id}
          key={todoList.completedTodos.length + todoList.doingTodos.length}
        />
      </div>

      <TodoList
        title="Things to do"
        todos={sortDoingTodos(todoList.doingTodos, todoOrderPreview)}
        emptyMessage="Come on! Don't you have anything to do?"
        renderTodo={(todoItem, index) => (
          <ReorderableTodoItem
            todoListId={todoList.id}
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
          <TodoItem todoListId={todoList.id} todo={todoItem} />
        )}
      />
    </section>
  );
};
