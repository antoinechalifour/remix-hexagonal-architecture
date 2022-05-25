import type { TodoDto, TodoListDto } from "shared/client";

import React from "react";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { Popover } from "front/ui/Popover";
import { TodoTag } from "front/todolist/TodoTag";
import { useFetcher } from "@remix-run/react";
import { PlainButton } from "front/ui/Button";
import classNames from "classnames";

type SelectedTagProps = { tag: string; todoList: TodoListDto; todo: TodoDto };
const SelectedTag = ({ tag, todoList, todo }: SelectedTagProps) => {
  const untagTodo = useFetcher();

  return (
    <Popover.Item className="grid grid-cols-[1rem_auto] items-center">
      <div>
        <DotFilledIcon className="text-primary" fill="currentColor" />
      </div>
      <untagTodo.Form
        method="post"
        action={`/l/${todoList.id}/todo/${todo.id}/untag`}
      >
        <input type="hidden" name="tag" value={tag} />
        <PlainButton type="submit">
          <TodoTag className="cursor-pointer">{tag}</TodoTag>
        </PlainButton>
      </untagTodo.Form>
    </Popover.Item>
  );
};

const SelectableTag = ({
  tag,
  todoList,
  todo,
}: {
  tag: string;
  todoList: TodoListDto;
  todo: TodoDto;
}) => {
  const tagTodo = useFetcher();
  const disabled = todo.tags.length === 3;

  return (
    <Popover.Item>
      <tagTodo.Form
        className="ml-4"
        method="post"
        action={`/l/${todoList.id}/todo/${todo.id}/tag`}
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

export const TagsList = ({
  todo,
  todoList,
}: {
  todo: TodoDto;
  todoList: TodoListDto;
}) => {
  const isTaggedWith = (tagToCheck: string) => todo.tags.includes(tagToCheck);

  return (
    <ul className="max-h-[210px] overflow-y-auto">
      {todoList.tags.map((tag) =>
        isTaggedWith(tag) ? (
          <li key={tag}>
            <SelectedTag tag={tag} todo={todo} todoList={todoList} />
          </li>
        ) : (
          <li key={tag}>
            <SelectableTag tag={tag} todo={todo} todoList={todoList} />
          </li>
        )
      )}
    </ul>
  );
};
