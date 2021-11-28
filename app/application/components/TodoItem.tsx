import type { TodoReadModel } from "~/query/TodoListReadModel";

import React from "react";
import { Form, useSubmit } from "remix";
import {
  CheckboxOption,
  links as checkboxOptionsLinks,
} from "../ui/CheckboxOption";
import { Button, links as buttonLinks } from "../ui/Button";
import { componentCss, link } from "../remix";
import css from "./TodoItem.css";

export const links = componentCss(
  ...checkboxOptionsLinks(),
  ...buttonLinks(),
  link(css)
);

interface TodoItemProps {
  todoListId: string;
  todo: TodoReadModel;
}

export const TodoItem = ({ todoListId, todo }: TodoItemProps) => {
  const submit = useSubmit();
  const htmlId = `todo-${todo.id}`;
  const handleChange = (e: React.ChangeEvent<HTMLFormElement>) =>
    submit(e.currentTarget);

  return (
    <div className="TodoItem">
      <Form
        method="post"
        action={`/l/${todoListId}/todo/${todo.id}`}
        onChange={handleChange}
        replace
      >
        <CheckboxOption
          id={htmlId}
          isChecked={todo.isComplete}
          label={todo.title}
        />
      </Form>

      <Form
        method="post"
        action={`/l/${todoListId}/todo/${todo.id}/archive`}
        replace
      >
        <Button title="Archive this todo">🗑</Button>
      </Form>
    </div>
  );
};
