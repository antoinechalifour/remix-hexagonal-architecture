import React from "react";
import { Link } from "@remix-run/react";
import { useTodoListOutdated } from "front/todolist/state";

export const TodoListOutdatedMessage = () => {
  const isOutdated = useTodoListOutdated();

  if (!isOutdated) return null;

  return (
    <div className="fixed bottom-2 left-2 right-2 z-50 sm:left-auto sm:bottom-10 sm:right-10">
      <p className="rounded bg-lighter p-4 text-inverse shadow">
        This todo list has been modified.{" "}
        <Link
          to=""
          replace
          className="underline decoration-dashed underline-offset-1"
        >
          Click to refresh!
        </Link>
      </p>
    </div>
  );
};
