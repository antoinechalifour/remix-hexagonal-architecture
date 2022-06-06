import type { TodoDto } from "shared/client";
import React, { useEffect } from "react";
import { DoubleArrowDownIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";
import { PlainButton } from "front/ui/Button";
import { useAllDoingTodos, useTodoListInfo } from "front/todolist/state";

export type SendToBottomProps = {
  todo: TodoDto;
  onDone: () => void;
};

export const SendToBottom = ({ todo, onDone }: SendToBottomProps) => {
  const sendToBottomFetcher = useFetcher();
  const { id } = useTodoListInfo();
  const doingTodos = useAllDoingTodos();

  useEffect(() => {
    if (sendToBottomFetcher.type !== "done") return;

    onDone();
  }, [onDone, sendToBottomFetcher.type]);

  return (
    <sendToBottomFetcher.Form method="post" action={`/l/${id}/order`}>
      <input type="hidden" name="todoId" value={todo.id} />
      <input type="hidden" name="newIndex" value={doingTodos.length - 1} />
      <PlainButton type="submit" className="flex w-full items-center">
        Send to bottom
        <DoubleArrowDownIcon className="ml-auto" width={12} height={12} />
      </PlainButton>
    </sendToBottomFetcher.Form>
  );
};
