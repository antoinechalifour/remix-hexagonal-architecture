import type { FloatingLabelInputRef } from "front/ui/FloatingLabelInput";
import React, { useEffect, useRef } from "react";
import { useFetcher } from "@remix-run/react";
import { UpdateIcon } from "@radix-ui/react-icons";
import { FloatingLabelInput } from "front/ui/FloatingLabelInput";
import { useTodoListInfo } from "front/todolist/state";
import { ButtonPrimary } from "front/ui/Button";

type ErrorReponse = {
  error: true;
  message: string;
};

export const ShareTodoListForm = () => {
  const grantAccessFetcher = useFetcher<ErrorReponse | null>();
  const inputRef = useRef<FloatingLabelInputRef | null>(null);
  const { id } = useTodoListInfo();
  const isBusy = grantAccessFetcher.state !== "idle";

  useEffect(() => {
    if (grantAccessFetcher.type !== "done") return;
    if (grantAccessFetcher.data?.error) return;

    inputRef.current?.clear();
  }, [grantAccessFetcher, grantAccessFetcher.type]);

  return (
    <grantAccessFetcher.Form
      action={`/l/${id}/grant-access`}
      method="post"
      className="space-y-4"
    >
      <p className="pb-1">Add someone else</p>

      <FloatingLabelInput
        name="email"
        label="Contributor email"
        ref={inputRef}
        inputProps={{ type: "email", className: "text-inverse" }}
        errorMessage={grantAccessFetcher.data?.message}
      />

      <ButtonPrimary type="submit" className="w-full" disabled={isBusy}>
        {isBusy ? <UpdateIcon className="mx-auto animate-spin" /> : "Share"}
      </ButtonPrimary>
    </grantAccessFetcher.Form>
  );
};
