import type { TodoDto } from "shared/client";
import React from "react";
import { useFetcher } from "@remix-run/react";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { Popover } from "front/ui/Popover";
import { PlainButton } from "front/ui/Button";
import { TodoTag } from "front/todolist/TodoTag";

export type SelectedTagProps = {
  tag: string;
  todoListId: string;
  todo: TodoDto;
};
export const SelectedTag = ({ tag, todoListId, todo }: SelectedTagProps) => {
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
