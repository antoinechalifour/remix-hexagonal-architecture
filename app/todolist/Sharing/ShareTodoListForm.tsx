import type { FloatingLabelInputRef } from "front/ui/FloatingLabelInput";
import React, { useEffect, useRef } from "react";
import { useFetcher } from "@remix-run/react";
import { FloatingLabelInput } from "front/ui/FloatingLabelInput";
import { ButtonPrimary } from "front/ui/Button";

export type ShareTodoListFormProps = { todoListId: string };

type ErrorReponse = {
  error: true;
  message: string;
};

export const ShareTodoListForm = ({ todoListId }: ShareTodoListFormProps) => {
  const shareTodoListFetcher = useFetcher<ErrorReponse | null>();
  const inputRef = useRef<FloatingLabelInputRef | null>(null);

  useEffect(() => {
    if (shareTodoListFetcher.type !== "done") return;
    if (shareTodoListFetcher.data?.error) return;

    inputRef.current?.clear();
  }, [shareTodoListFetcher, shareTodoListFetcher.type]);

  return (
    <shareTodoListFetcher.Form
      action={`/l/${todoListId}/share`}
      method="post"
      className="space-y-4"
    >
      <FloatingLabelInput
        name="email"
        label="Collaborator email"
        ref={inputRef}
        inputProps={{ type: "email", className: "text-inverse" }}
        errorMessage={shareTodoListFetcher.data?.message}
      />
      <ButtonPrimary type="submit" className="w-full">
        Share
      </ButtonPrimary>
    </shareTodoListFetcher.Form>
  );
};
