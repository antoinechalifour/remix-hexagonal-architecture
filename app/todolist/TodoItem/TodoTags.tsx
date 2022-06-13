import type { TodoDto } from "shared/client";
import React from "react";
import classNames from "classnames";
import { TodoTag } from "front/todolist/TodoTag";

export type TodoTagsProps = { todo: TodoDto };
export const TodoTags = ({ todo }: TodoTagsProps) => (
  <ul
    className={classNames(
      "col-start-2 row-start-2 md:col-start-3 md:row-start-1",
      "flex flex-wrap sm:space-x-1"
    )}
  >
    {todo.tags.map((tag) => (
      <li key={tag} className="p-1 sm:p-0">
        <TodoTag>{tag}</TodoTag>
      </li>
    ))}
  </ul>
);
