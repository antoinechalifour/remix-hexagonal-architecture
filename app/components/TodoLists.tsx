import type { HomePageTodoListDto } from "shared";

import React from "react";
import { isEmpty } from "fp-ts/Array";
import { EmptyMessage } from "../ui/EmptyMessage";
import { PageTitle } from "../ui/PageTitle";
import { links as todoListItemLinks, TodoListItem } from "./TodoListItem";
import {
  AddTodoListForm,
  links as addTodoListFormLinks,
} from "./AddTodoListForm";
import { componentCss, link } from "../stylesheet";
import css from "./TodoLists.css";

export const links = componentCss(
  ...addTodoListFormLinks(),
  ...todoListItemLinks(),
  link(css)
);

interface TodoListsProps {
  todoLists: HomePageTodoListDto[];
}

export const TodoLists = ({ todoLists }: TodoListsProps) => (
  <section className="TodoLists">
    <PageTitle>Welcome, these are your todo lists</PageTitle>

    <AddTodoListForm />

    {isEmpty(todoLists) ? (
      <EmptyMessage>No todo list has been added yet!</EmptyMessage>
    ) : (
      <ol>
        {todoLists.map((todoList) => (
          <li className="TodoLists__item" key={todoList.id}>
            <TodoListItem todoList={todoList} />
          </li>
        ))}
      </ol>
    )}
  </section>
);
