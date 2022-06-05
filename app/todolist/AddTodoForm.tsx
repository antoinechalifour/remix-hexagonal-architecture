import type { AddTodoErrorDto } from "shared/client";
import type { FloatingLabelInputRef } from "front/ui/FloatingLabelInput";

import { useEffect, useRef } from "react";
import { useFetcher } from "@remix-run/react";
import { FloatingLabelInput } from "front/ui/FloatingLabelInput";
import { ButtonPrimary } from "front/ui/Button";
import { useOptimisticUpdates } from "front/todolist/state";

type ActionData = {
  errors?: AddTodoErrorDto;
};

export const AddTodoForm = () => {
  const { ref, addTodoFetcher } = useAddTodoForm();

  return (
    <addTodoFetcher.Form
      method="post"
      replace
      className="my-10 grid grid-cols-[1fr_auto] items-center gap-2 sm:gap-5"
    >
      <FloatingLabelInput
        label="What needs to be done?"
        name="todoTitle"
        errorMessage={addTodoFetcher.data?.errors?.todoTitle}
        ref={ref}
        inputProps={{ maxLength: 50 }}
      />

      <ButtonPrimary
        type="submit"
        disabled={addTodoFetcher.state === "submitting"}
      >
        Add
      </ButtonPrimary>
    </addTodoFetcher.Form>
  );
};

function useAddTodoForm() {
  const addTodoFetcher = useFetcher<ActionData>();
  const isSubmitting = useRef(false);
  const floatingLabelInputRef = useRef<FloatingLabelInputRef>(null);
  const { addTodo } = useOptimisticUpdates();

  useEffect(() => {
    if (addTodoFetcher.state === "submitting") {
      isSubmitting.current = true;
      return;
    }

    if (isSubmitting.current && addTodoFetcher.state === "idle") {
      floatingLabelInputRef.current?.focus();
      isSubmitting.current = false;
      return;
    }
  }, [addTodoFetcher.state]);

  useEffect(() => {
    if (addTodoFetcher.type === "done") {
      floatingLabelInputRef.current?.clear();
    }
  }, [addTodoFetcher.type]);

  useEffect(() => {
    const submission = addTodoFetcher.submission;
    if (submission == null) return;
    addTodo(submission.formData.get("todoTitle") as string);
  }, [addTodo, addTodoFetcher.submission]);

  return { ref: floatingLabelInputRef, addTodoFetcher };
}
