import type { HomePageTodoListReadModel } from "~/query/HomePageReadModel";

import { Form, Link } from "remix";
import { displayDate } from "~/domain/Date";
import { Button, links as buttonLinks } from "../ui/Button";
import { componentCss, link } from "../remix";
import css from "./TodoListItem.css";

export const links = componentCss(...buttonLinks(), link(css));

interface TodoListItemProps {
  todoList: HomePageTodoListReadModel;
}

export const TodoListItem = ({ todoList }: TodoListItemProps) => (
  <div className="TodoListItem">
    <h2 className="TodoListItem__title">
      <Link to={`/l/${todoList.id}`}>{todoList.title}</Link>{" "}
      <span className="TodoListItem__todos">({todoList.numberOfTodos})</span>
    </h2>
    <Form
      method="post"
      action={`/l/${todoList.id}/archive`}
      replace
      className="TodolistItem__remove"
    >
      <Button title="Archive this list">🗑</Button>
    </Form>
    <p className="TodoListItem__info">
      ↳ Created {displayDate(todoList.createdAt)}
    </p>
  </div>
);
