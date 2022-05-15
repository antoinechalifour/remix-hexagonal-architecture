import type { AddTodoListErrorDto } from "shared";

import { useFetcher } from "@remix-run/react";
import { FloatingLabelInput } from "front/ui/FloatingLabelInput";
import { ButtonPrimary } from "front/ui/Button";

type ActionData = {
  errors?: AddTodoListErrorDto;
};

export const AddTodoListForm = () => {
  const fetcher = useFetcher<ActionData>();

  return (
    <fetcher.Form
      method="post"
      className="grid grid-cols-[1fr_auto] items-center gap-5"
    >
      <FloatingLabelInput
        name="title"
        label="Add a new todo list"
        errorMessage={fetcher.data?.errors?.title}
      />

      <ButtonPrimary disabled={fetcher.state === "submitting"}>
        Done
      </ButtonPrimary>
    </fetcher.Form>
  );
};
