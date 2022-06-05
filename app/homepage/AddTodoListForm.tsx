import type { AddTodoListErrorDto } from "shared/client";

import { useFetcher } from "@remix-run/react";
import { FloatingLabelInput } from "front/ui/FloatingLabelInput";
import { ButtonPrimary } from "front/ui/Button";

type ActionData = {
  errors?: AddTodoListErrorDto;
};

export const AddTodoListForm = () => {
  const addTodoList = useFetcher<ActionData>();

  return (
    <addTodoList.Form
      method="post"
      className="grid grid-cols-[1fr_auto] items-center gap-2 sm:gap-5"
    >
      <FloatingLabelInput
        name="title"
        label="Add a new todo list"
        errorMessage={addTodoList.data?.errors?.title}
        inputProps={{
          maxLength: 50,
        }}
      />

      <ButtonPrimary
        type="submit"
        disabled={addTodoList.state === "submitting"}
      >
        Add
      </ButtonPrimary>
    </addTodoList.Form>
  );
};
