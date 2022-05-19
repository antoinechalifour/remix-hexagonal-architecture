import type { TodoDto, TodoListDto } from "shared";
import React from "react";
import { useFetcher } from "@remix-run/react";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { Popover } from "front/ui/Popover";
import { PlainButton } from "front/ui/Button";
import { TagsList } from "front/components/TagsList";
import { AddTag } from "front/components/AddTag";

export type TodoPopoverContentProps = {
  todoList: TodoListDto;
  todo: TodoDto;
};
export const TodoPopoverContent = ({
  todoList,
  todo,
}: TodoPopoverContentProps) => {
  const archiveTodo = useFetcher();
  const isArchiving = archiveTodo.state === "submitting";

  return (
    <Popover.Content>
      <Popover.SectionTitle className="text-faded">Tags</Popover.SectionTitle>

      <TagsList todo={todo} todoList={todoList} />
      <AddTag todo={todo} todoList={todoList} />

      <Popover.Separator />

      <Popover.SectionTitle className="text-danger">
        Danger zone
      </Popover.SectionTitle>

      <Popover.Item>
        <archiveTodo.Form
          method="post"
          action={`/l/${todoList.id}/todo/${todo.id}/archive`}
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
