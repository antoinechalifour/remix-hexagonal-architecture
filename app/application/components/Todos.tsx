import type { TodoListReadModel } from "~/query/TodoListReadModel";

import React from "react";
import { displayDate } from "~/domain/Date";
import { links as emptyMessageLinks } from "../ui/EmptyMessage";
import { PageTitle, links as pageTitleLinks } from "../ui/PageTitle";
import { AddTodoForm, links as addTodoFormLinks } from "./AddTodoForm";
import { TodoList, links as todoListLinks } from "./TodoList";
import { componentCss, link } from "~/application/remix/styling";
import css from "./Todos.css";

export const links = componentCss(
  ...addTodoFormLinks(),
  ...emptyMessageLinks(),
  ...pageTitleLinks(),
  ...todoListLinks(),
  link(css)
);

interface TodosProps {
  todoList: TodoListReadModel;
}

export const Todos = ({ todoList }: TodosProps) => (
  <section className="Todos">
    <PageTitle>{todoList.title}</PageTitle>
    <p className="Todos__info">
      ↳ You created this list {displayDate(todoList.createdAt)}
    </p>

    <AddTodoForm
      todoListId={todoList.id}
      key={todoList.completedTodos.length + todoList.doingTodos.length}
    />

    <TodoList
      title="Things to do"
      todoListId={todoList.id}
      todos={todoList.doingTodos}
      emptyMessage="Come on! Don't you have anything to do?"
    />

    <TodoList
      title="Things done"
      todoListId={todoList.id}
      todos={todoList.completedTodos}
      emptyMessage="Alright let's get to work!"
    />
  </section>
);
