import type { HomePageTodoListDto } from "shared";

import { Form, Link, useTransition } from "remix";
import classNames from "classnames";
import { displayDate } from "front/Date";
import { Button } from "front/ui/Button";

interface TodoListItemProps {
  todoList: HomePageTodoListDto;
}

export const TodoListItem = ({ todoList }: TodoListItemProps) => {
  const transition = useTransition();
  const archiveAction = `/l/${todoList.id}/archive`;
  const isArchiving = transition.submission?.action === archiveAction;

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
      <Form
        method="post"
        action={archiveAction}
        replace
        className="row-span-2 flex content-center"
      >
        <Button disabled={isArchiving} title="Archive this list">
          🗑
        </Button>
      </Form>
      <p className="pl-4 text-sm text-light">
        ↳ Created {displayDate(todoList.createdAt)}
      </p>
    </div>
  );
};
