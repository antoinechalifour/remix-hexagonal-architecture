import type { FloatingLabelInputRef } from "front/ui/FloatingLabelInput";
import React, { useEffect, useRef } from "react";
import { useFetcher } from "@remix-run/react";
import { FloatingLabelInput } from "front/ui/FloatingLabelInput";
import { ButtonPrimary } from "front/ui/Button";

export type ShareTodoListFormProps = { todoListId: string };

export const ShareTodoListForm = ({ todoListId }: ShareTodoListFormProps) => {
  const shareTodoList = useFetcher();
  const inputRef = useRef<FloatingLabelInputRef | null>(null);

  useEffect(() => {
    if (shareTodoList.type !== "done") return;
    inputRef.current?.clear();
  }, [shareTodoList.type]);

  return (
    <shareTodoList.Form
      action={`/l/${todoListId}/share`}
      method="post"
      className="space-y-4"
    >
      <FloatingLabelInput
        name="email"
        label="Collaborator email"
        ref={inputRef}
        inputProps={{ type: "email", className: "text-inverse" }}
      />
      <ButtonPrimary type="submit" className="w-full">
        Share
      </ButtonPrimary>
    </shareTodoList.Form>
  );
};
