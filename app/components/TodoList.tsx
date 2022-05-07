import type { TodoDto } from "shared";

import React from "react";
import { isEmpty } from "fp-ts/Array";
import { EmptyMessage } from "../ui/EmptyMessage";
import { TodoItem, links as todoItemLinks } from "./TodoItem";
import { componentCss, link } from "../stylesheet";
import css from "./TodoList.css";

export const links = componentCss(...todoItemLinks(), link(css));

interface TodoListProps {
  title: string;
  todoListId: string;
  todos: TodoDto[];
  emptyMessage: string;
}

export const TodoList = ({
  title,
  todoListId,
  todos,
  emptyMessage,
}: TodoListProps) => (
  <section className="TodoList">
    <h2 className="TodoList__title">
      {title} ({todos.length})
    </h2>

    {isEmpty(todos) ? (
      <EmptyMessage>{emptyMessage}</EmptyMessage>
    ) : (
      <ol className="TodoList__list">
        {todos.map((todo) => (
          <li key={todo.id}>
            <TodoItem todoListId={todoListId} todo={todo} />
          </li>
        ))}
      </ol>
    )}
  </section>
);
