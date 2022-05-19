import type { TodoDto, TodoListDto } from "shared";
import React from "react";
import { useFetcher } from "@remix-run/react";
import { Popover } from "front/ui/Popover";

export type AddTagProps = {
  todoList: TodoListDto;
  todo: TodoDto;
};

export const AddTag = ({ todoList, todo }: AddTagProps) => {
  const tagTodo = useFetcher();
  return (
    <Popover.Item>
      <tagTodo.Form
        method="post"
        action={`/l/${todoList.id}/todo/${todo.id}/tag`}
      >
        <input
          className="ml-4 w-[15ch] rounded bg-gray-200 py-1 px-2 font-mono text-xs text-gray-700"
          placeholder="New tag..."
          name="tag"
        />

        <button type="submit" className="sr-only">
          Tag
        </button>
      </tagTodo.Form>
    </Popover.Item>
  );
};
