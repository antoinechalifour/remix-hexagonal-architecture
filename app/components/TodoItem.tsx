import type { TodoDto } from "shared";

import React from "react";
import classNames from "classnames";
import { Form, useSubmit, useTransition } from "remix";
import {
  CheckboxOption,
  links as checkboxOptionsLinks,
} from "../ui/CheckboxOption";
import { Button, links as buttonLinks } from "../ui/Button";
import { componentCss, link } from "../stylesheet";
import css from "./TodoItem.css";

export const links = componentCss(
  ...checkboxOptionsLinks(),
  ...buttonLinks(),
  link(css)
);

interface TodoItemProps {
  todoListId: string;
  todo: TodoDto;
}

export const TodoItem = ({ todoListId, todo }: TodoItemProps) => {
  const submit = useSubmit();
  const transition = useTransition();
  const htmlId = `todo-${todo.id}`;
  const completionAction = `/l/${todoListId}/todo/${todo.id}`;
  const archiveAction = `/l/${todoListId}/todo/${todo.id}/archive`;
  const isArchiving = transition.submission?.action === archiveAction;

  const handleChange = (e: React.ChangeEvent<HTMLFormElement>) =>
    submit(e.currentTarget);

  return (
    <div
      className={classNames("TodoItem", { "TodoItem--archiving": isArchiving })}
    >
      <Form
        method="post"
        action={completionAction}
        onChange={handleChange}
        replace
      >
        <CheckboxOption
          id={htmlId}
          isChecked={todo.isComplete}
          label={todo.title}
        />
      </Form>

      <Form method="post" action={archiveAction} replace>
        <Button disabled={isArchiving} title="Archive this todo">
          🗑
        </Button>
      </Form>
    </div>
  );
};
