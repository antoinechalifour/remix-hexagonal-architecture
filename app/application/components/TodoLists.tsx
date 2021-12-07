import type { HomePageTodoListReadModel } from "~/query/HomePageReadModel";

import React from "react";
import { isEmpty } from "fp-ts/Array";
import { EmptyMessage, links as emptyMessageLinks } from "../ui/EmptyMessage";
import { links as pageTitleLinks, PageTitle } from "../ui/PageTitle";
import { links as todoListItemLinks, TodoListItem } from "./TodoListItem";
import {
  AddTodoListForm,
  links as addTodoListFormLinks,
} from "./AddTodoListForm";
import { componentCss, link } from "~/application/remix/styling";
import css from "./TodoLists.css";

export const links = componentCss(
  ...addTodoListFormLinks(),
  ...todoListItemLinks(),
  ...emptyMessageLinks(),
  ...pageTitleLinks(),
  link(css)
);

interface TodoListsProps {
  todoLists: HomePageTodoListReadModel[];
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
