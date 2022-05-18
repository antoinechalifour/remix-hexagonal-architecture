import type { TodoDto } from "shared";
import React from "react";
import { useFetcher } from "@remix-run/react";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { Popover } from "front/ui/Popover";
import { TodoTag } from "front/components/TodoTag";
import { PlainButton } from "front/ui/Button";

export type TodoPopoverContentProps = {
  todoListId: string;
  todo: TodoDto;
};
export const TodoPopoverContent = ({
  todoListId,
  todo,
}: TodoPopoverContentProps) => {
  const archiveTodo = useFetcher();
  const tagTodo = useFetcher();
  const isArchiving = archiveTodo.state === "submitting";

  return (
    <Popover.Content>
      <Popover.SectionTitle className="text-faded">Tags</Popover.SectionTitle>

      {todo.tags.map((tag) => (
        <Popover.Item key={tag}>
          <TodoTag className="ml-2">{tag}</TodoTag>
        </Popover.Item>
      ))}

      <Popover.Item>
        <tagTodo.Form
          method="post"
          action={`/l/${todoListId}/todo/${todo.id}/tag`}
        >
          <input
            className="ml-2 w-[15ch] rounded bg-gray-200 py-1 px-2 font-mono text-xs text-gray-700"
            placeholder="New tag..."
            name="tag"
          />

          <button type="submit" className="sr-only">
            Tag
          </button>
        </tagTodo.Form>
      </Popover.Item>

      <Popover.Separator />

      <Popover.SectionTitle className="text-danger">
        Danger zone
      </Popover.SectionTitle>

      <Popover.Item>
        <archiveTodo.Form
          method="post"
          action={`/l/${todoListId}/todo/${todo.id}/archive`}
          replace
          className="flex items-center"
        >
          <PlainButton
            type="submit"
            disabled={isArchiving}
            className="relative flex w-full items-center text-danger"
            title="Archive this todo"
          >
            Archive
            <CrossCircledIcon
              className="ml-auto text-danger"
              width={20}
              height={20}
            />
          </PlainButton>
        </archiveTodo.Form>
      </Popover.Item>

      <Popover.Arrow />
    </Popover.Content>
  );
};
