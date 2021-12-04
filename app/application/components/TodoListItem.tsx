import type { HomePageTodoListReadModel } from "~/query/HomePageReadModel";

import { Form, Link, useTransition } from "remix";
import classNames from "classnames";
import { displayDate } from "~/domain/Date";
import { Button, links as buttonLinks } from "../ui/Button";
import { componentCss, link } from "../remix";
import css from "./TodoListItem.css";

export const links = componentCss(...buttonLinks(), link(css));

interface TodoListItemProps {
  todoList: HomePageTodoListReadModel;
}

export const TodoListItem = ({ todoList }: TodoListItemProps) => {
  const transition = useTransition();
  const archiveAction = `/l/${todoList.id}/archive`;
  const isArchiving = transition.submission?.action === archiveAction;

  return (
    <div
      className={classNames("TodoListItem", {
        "TodoListItem--archiving": isArchiving,
      })}
    >
      <h2 className="TodoListItem__title">
        <Link to={`/l/${todoList.id}`}>{todoList.title}</Link>{" "}
        <span className="TodoListItem__todos">({todoList.numberOfTodos})</span>
      </h2>
      <Form
        method="post"
        action={archiveAction}
        replace
        className="TodolistItem__remove"
      >
        <Button disabled={isArchiving} title="Archive this list">
          🗑
        </Button>
      </Form>
      <p className="TodoListItem__info">
        ↳ Created {displayDate(todoList.createdAt)}
      </p>
    </div>
  );
};
