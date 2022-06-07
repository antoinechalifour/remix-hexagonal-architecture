import type { TodoDto } from "shared/client";

import React, { useEffect, useRef } from "react";
import { useFetcher } from "@remix-run/react";
import { Popover } from "front/ui/Popover";
import { useTodoListInfo } from "front/todolist/state";

export type AddTagProps = {
  todo: TodoDto;
};

export const AddTag = ({ todo }: AddTagProps) => {
  const { id } = useTodoListInfo();
  const addTagFetcher = useFetcher();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (addTagFetcher.type !== "done") return;

    const input = inputRef.current;
    if (input == null) return;
    input.value = "";
  }, [addTagFetcher.type]);

  if (todo.tags.length === 3) return null;

  return (
    <Popover.Item>
      <addTagFetcher.Form
        method="post"
        action={`/l/${id}/todo/${todo.id}/add-tag`}
      >
        <input
          ref={inputRef}
          className="ml-4 w-[15ch] rounded bg-gray-200 py-1 px-2 font-mono text-xs text-gray-700"
          placeholder="New tag..."
          name="tag"
          required
          maxLength={15}
        />

        <button type="submit" className="sr-only">
          Tag
        </button>
      </addTagFetcher.Form>
    </Popover.Item>
  );
};
