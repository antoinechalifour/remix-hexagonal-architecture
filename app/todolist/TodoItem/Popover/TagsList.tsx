import type { TodoDto } from "shared/client";
import React from "react";
import { useTodoListInfo } from "front/todolist/state";
import { SelectableTag } from "front/todolist/TodoItem/Popover/SelectableTag";
import { SelectedTag } from "front/todolist/TodoItem/Popover/SelectedTag";

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
