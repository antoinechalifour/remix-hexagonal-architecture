import type { TodoListSummaryWithPermissionDto } from "shared/client";
import React from "react";
import { Link, useFetcher } from "@remix-run/react";
import classNames from "classnames";
import { ArchiveTodoList } from "front/homepage/ArchiveTodoList";
import { TodoListTimeInfo } from "front/homepage/TodoListTimeInfo";

interface TodoListItemProps {
  todoList: TodoListSummaryWithPermissionDto;
}

export const TodoListItem = ({ todoList }: TodoListItemProps) => {
  const archiveTodoListFetcher = useFetcher();
  const isArchiving = archiveTodoListFetcher.state !== "idle";

  return (
    <div
      className={classNames(
        "grid grid-cols-[1fr_auto] gap-1",
        "rounded bg-dark py-4 px-6 shadow",
        {
          "opacity-50": isArchiving,
        }
      )}
    >
      <h3 className="flex items-center text-lg font-semibold text-lighter">
        <Link to={`/l/${todoList.id}`}>{todoList.title}</Link>{" "}
        <span className="ml-2 mt-px text-sm font-normal text-light">
          ({todoList.numberOfTodos})
        </span>
      </h3>

      <div className="row-span-2 flex content-center">
        {todoList.permissions.archive && (
          <ArchiveTodoList
            todoList={todoList}
            fetcher={archiveTodoListFetcher}
          />
        )}
      </div>

      <TodoListTimeInfo todoList={todoList} />
    </div>
  );
};
