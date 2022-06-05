import type { TodoDto } from "shared/client";

import React from "react";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";
import classNames from "classnames";
import { Popover } from "front/ui/Popover";
import { TodoTag } from "front/todolist/TodoTag";
import { PlainButton } from "front/ui/Button";
import { useTodoListInfo } from "front/todolist/state";

type SelectedTagProps = {
  tag: string;
  todoListId: string;
  todo: TodoDto;
};
const SelectedTag = ({ tag, todoListId, todo }: SelectedTagProps) => {
  const untagTodo = useFetcher();

  return (
    <Popover.Item className="grid grid-cols-[1rem_auto] items-center">
      <div>
        <DotFilledIcon className="text-primary" fill="currentColor" />
      </div>
      <untagTodo.Form
        method="post"
        action={`/l/${todoListId}/todo/${todo.id}/untag`}
      >
        <input type="hidden" name="tag" value={tag} />
        <PlainButton type="submit">
          <TodoTag className="cursor-pointer">{tag}</TodoTag>
        </PlainButton>
      </untagTodo.Form>
    </Popover.Item>
  );
};

type SelectableTagProps = {
  tag: string;
  todoListId: string;
  todo: TodoDto;
};
const SelectableTag = ({ tag, todoListId, todo }: SelectableTagProps) => {
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
        <PlainButton type="submit">
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

export const TagsList = ({ todo }: { todo: TodoDto }) => {
  const isTaggedWith = (tagToCheck: string) => todo.tags.includes(tagToCheck);
  const { id, tags } = useTodoListInfo();

  return (
    <ul className="max-h-[210px] overflow-y-auto">
      {tags.map((tag) =>
        isTaggedWith(tag) ? (
          <li key={tag}>
            <SelectedTag tag={tag} todo={todo} todoListId={id} />
          </li>
        ) : (
          <li key={tag}>
            <SelectableTag tag={tag} todo={todo} todoListId={id} />
          </li>
        )
      )}
    </ul>
  );
};
