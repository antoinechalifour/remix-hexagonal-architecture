import type { TodoDto } from "shared/client";
import React, { useEffect } from "react";
import { DoubleArrowUpIcon } from "@radix-ui/react-icons";
import { useFetcher } from "@remix-run/react";
import { PlainButton } from "front/ui/Button";
import { useTodoListInfo } from "front/todolist/state";

export type SendToTopProps = {
  todo: TodoDto;
  onDone: () => void;
};

export const SendToTop = ({ todo, onDone }: SendToTopProps) => {
  const sendToTopFetcher = useFetcher();
  const { id } = useTodoListInfo();

  useEffect(() => {
    if (sendToTopFetcher.type !== "done") return;

    onDone();
  }, [onDone, sendToTopFetcher.type]);

  return (
    <sendToTopFetcher.Form method="post" action={`/l/${id}/order`}>
      <input type="hidden" name="todoId" value={todo.id} />
      <input type="hidden" name="newIndex" value={0} />
      <PlainButton type="submit" className="flex w-full items-center">
        Send to top
        <DoubleArrowUpIcon className="ml-auto" width={16} height={16} />
      </PlainButton>
    </sendToTopFetcher.Form>
  );
};
