import type { TodoDto } from "shared/client";
import React from "react";
import { useTodoListInfo } from "front/todolist/state";
import { SelectableTag } from "front/todolist/TodoItem/Popover/SelectableTag";
import { SelectedTag } from "front/todolist/TodoItem/Popover/SelectedTag";

export const TagsList = ({ todo }: { todo: TodoDto }) => {
  const isTaggedWith = (tagToCheck: string) => todo.tags.includes(tagToCheck);
  const { id, tags } = useTodoListInfo();

  return (
    <ul className="-mt-2 -mb-2 max-h-[210px] overflow-y-auto py-2">
      {tags.map((tag) => (
        <li key={tag}>
          {isTaggedWith(tag) ? (
            <SelectedTag tag={tag} todo={todo} todoListId={id} />
          ) : (
            <SelectableTag tag={tag} todo={todo} todoListId={id} />
          )}
        </li>
      ))}
    </ul>
  );
};
