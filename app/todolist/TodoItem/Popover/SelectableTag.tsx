import type { TodoDto } from "shared/client";
import React from "react";
import classNames from "classnames";
import { useFetcher } from "@remix-run/react";
import { Popover } from "front/ui/Popover";
import { PlainButton } from "front/ui/Button";
import { TodoTag } from "front/todolist/TodoTag";

export type SelectableTagProps = {
  tag: string;
  todoListId: string;
  todo: TodoDto;
};

export const SelectableTag = ({
  tag,
  todoListId,
  todo,
}: SelectableTagProps) => {
  const tagTodo = useFetcher();
  const disabled = todo.tags.length === 3;

  return (
    <Popover.Item>
      <tagTodo.Form
        className="ml-4"
        method="post"
        action={`/l/${todoListId}/todo/${todo.id}/tag`}
      >
        <input type="hidden" name="tag" value={tag} disabled={disabled} />
        <PlainButton type="submit" className="py-1">
          <TodoTag
            className={classNames({
              "cursor-pointer": !disabled,
              "cursor-not-allowed": disabled,
            })}
          >
            {tag}
          </TodoTag>
        </PlainButton>
      </tagTodo.Form>
    </Popover.Item>
  );
};
