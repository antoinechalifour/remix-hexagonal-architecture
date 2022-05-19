import type { TodoDto, TodoListDto } from "shared";
import React from "react";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { Popover } from "front/ui/Popover";
import { TodoTag } from "front/components/TodoTag";
import { useFetcher } from "@remix-run/react";
import { PlainButton } from "front/ui/Button";

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

  return (
    <Popover.Item>
      <tagTodo.Form
        method="post"
        action={`/l/${todoList.id}/todo/${todo.id}/tag`}
      >
        <input type="hidden" name="tag" value={tag} />
        <PlainButton type="submit">
          <TodoTag className="ml-4 cursor-pointer">{tag}</TodoTag>
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
    <>
      {todoList.tags.map((tag) =>
        isTaggedWith(tag) ? (
          <SelectedTag key={tag} tag={tag} todo={todo} todoList={todoList} />
        ) : (
          <SelectableTag key={tag} tag={tag} todo={todo} todoList={todoList} />
        )
      )}
    </>
  );
};
