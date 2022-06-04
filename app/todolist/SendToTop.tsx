import type { TodoDto, TodoListDetailsDto } from "shared/client";
import React from "react";
import { DoubleArrowUpIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";
import { PlainButton } from "front/ui/Button";

export type SendToTopProps = {
  todoList: TodoListDetailsDto;
  todo: TodoDto;
};

export const SendToTop = ({ todoList, todo }: SendToTopProps) => {
  const sendToTop = useFetcher();

  return (
    <sendToTop.Form method="post" action={`/l/${todoList.id}/order`}>
      <input type="hidden" name="todoId" value={todo.id} />
      <input type="hidden" name="newIndex" value={0} />
      <PlainButton type="submit" className="flex w-full items-center">
        Send to top
        <DoubleArrowUpIcon className="ml-auto " width={16} height={16} />
      </PlainButton>
    </sendToTop.Form>
  );
};
