import type { HomePageTodoListDto } from "shared";

import { Form, Link, useTransition } from "remix";
import classNames from "classnames";
import { displayDate } from "../Date";
import { Button } from "../ui/Button";
import { componentCss, link } from "../stylesheet";
import css from "./TodoListItem.css";

export const links = componentCss(link(css));

interface TodoListItemProps {
  todoList: HomePageTodoListDto;
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
