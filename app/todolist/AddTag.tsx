import type { TodoDto } from "shared/client";

import React, { useEffect, useRef } from "react";
import { useFetcher } from "@remix-run/react";
import { Popover } from "front/ui/Popover";
import { useOptimisticUpdates, useTodoListInfo } from "front/todolist/state";

export type AddTagProps = {
  todo: TodoDto;
};

export const AddTag = ({ todo }: AddTagProps) => {
  const { id } = useTodoListInfo();
  const { tagTodoFetcher, inputRef } = useAddTag(todo);

  if (todo.tags.length === 3) return null;

  return (
    <Popover.Item>
      <tagTodoFetcher.Form
        method="post"
        action={`/l/${id}/todo/${todo.id}/tag`}
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
      </tagTodoFetcher.Form>
    </Popover.Item>
  );
};

function useAddTag(todo: TodoDto) {
  const tagTodoFetcher = useFetcher();
  const inputRef = useRef<HTMLInputElement>(null);
  const { tagTodo } = useOptimisticUpdates();

  useEffect(() => {
    if (tagTodoFetcher.type !== "done") return;

    const input = inputRef.current;
    if (input == null) return;
    input.value = "";
  }, [tagTodoFetcher.type]);

  useEffect(() => {
    const submission = tagTodoFetcher.submission;
    if (submission == null) return;
    tagTodo(todo.id, submission.formData.get("tag") as string);
  }, [tagTodo, tagTodoFetcher.submission, todo.id]);

  return { tagTodoFetcher, inputRef };
}
