import type { TodoListSummaryDto } from "shared/client";
import React from "react";
import { displayDate } from "front/Date";

export type TodoListTimeInfoProps = { todoList: TodoListSummaryDto };
export const TodoListTimeInfo = ({ todoList }: TodoListTimeInfoProps) => {
  let message = `Created ${displayDate(todoList.createdAt)}`;

  if (todoList.lastUpdatedAt != null) {
    message = `Modified ${displayDate(todoList.lastUpdatedAt)}`;
  }

  return <p className="pl-4 text-xs text-light">↳ {message}</p>;
};
