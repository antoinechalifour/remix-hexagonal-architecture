import type { AddTodoErrorDto } from "shared";
import type { FloatingLabelInputRef } from "front/ui/FloatingLabelInput";

import { useEffect, useRef } from "react";
import { useFetcher } from "@remix-run/react";
import { FloatingLabelInput } from "front/ui/FloatingLabelInput";
import { ButtonPrimary } from "front/ui/Button";

type ActionData = {
  errors?: AddTodoErrorDto;
};

export const AddTodoForm = () => {
  const { ref, addTodo } = useAddTodoForm();

  return (
    <addTodo.Form
      method="post"
      replace
      className="grid grid-cols-[1fr_auto] items-center gap-5"
    >
      <FloatingLabelInput
        label="What needs to be done?"
        name="todoTitle"
        errorMessage={addTodo.data?.errors?.todoTitle}
        ref={ref}
      />

      <ButtonPrimary type="submit" disabled={addTodo.state === "submitting"}>
        Done
      </ButtonPrimary>
    </addTodo.Form>
  );
};

function useAddTodoForm() {
  const addTodo = useFetcher<ActionData>();
  const isSubmitting = useRef(false);
  const floatingLabelInputRef = useRef<FloatingLabelInputRef>(null);

  useEffect(() => {
    if (addTodo.state === "submitting") {
      isSubmitting.current = true;
      return;
    }

    if (isSubmitting.current && addTodo.state === "idle") {
      floatingLabelInputRef.current?.focus();
      isSubmitting.current = false;
      return;
    }
  }, [addTodo.state]);

  useEffect(() => {
    if (addTodo.type === "done") {
      floatingLabelInputRef.current?.clear();
    }
  }, [addTodo.type]);

  return { ref: floatingLabelInputRef, addTodo };
}
