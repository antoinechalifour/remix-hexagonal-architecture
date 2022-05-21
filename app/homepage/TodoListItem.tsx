import type { HomePageTodoListDto } from "shared/client";

import { Link } from "remix";
import { useFetcher } from "@remix-run/react";
import classNames from "classnames";
import { displayDate } from "front/Date";
import { Button } from "front/ui/Button";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import React from "react";

interface TodoListItemProps {
  todoList: HomePageTodoListDto;
}

export const TodoListItem = ({ todoList }: TodoListItemProps) => {
  const archiveTodoList = useFetcher();
  const isArchiving = archiveTodoList.state === "submitting";

  return (
    <div
      className={classNames(
        "grid grid-cols-[1fr_auto] grid-rows-2 gap-2",
        "rounded-2xl bg-dark py-4 px-6 shadow",
        {
          "opacity-50": isArchiving,
        }
      )}
    >
      <h2 className="flex items-center text-lg font-semibold text-lighter">
        <Link to={`/l/${todoList.id}`}>{todoList.title}</Link>{" "}
        <span className="ml-2 mt-px text-sm font-normal text-light">
          ({todoList.numberOfTodos})
        </span>
      </h2>

      <archiveTodoList.Form
        method="post"
        action={`/l/${todoList.id}/archive`}
        replace
        className="row-span-2 flex content-center"
      >
        <Button type="submit" disabled={isArchiving} title="Archive this list">
          <CrossCircledIcon
            className="text-danger-lighter"
            width={20}
            height={20}
          />
        </Button>
      </archiveTodoList.Form>

      <p className="pl-4 text-sm text-light">
        ↳ Created {displayDate(todoList.createdAt)}
      </p>
    </div>
  );
};
