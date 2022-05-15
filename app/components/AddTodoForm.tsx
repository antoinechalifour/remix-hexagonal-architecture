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
  const { ref, fetcher } = useAddTodoForm();

  return (
    <fetcher.Form
      method="post"
      replace
      className="grid grid-cols-[1fr_auto] items-center gap-5"
    >
      <FloatingLabelInput
        label="What needs to be done?"
        name="todoTitle"
        errorMessage={fetcher.data?.errors?.todoTitle}
        ref={ref}
      />

      <ButtonPrimary disabled={fetcher.state === "submitting"}>
        Done
      </ButtonPrimary>
    </fetcher.Form>
  );
};

function useAddTodoForm() {
  const fetcher = useFetcher<ActionData>();
  const isSubmitting = useRef(false);
  const floatingLabelInputRef = useRef<FloatingLabelInputRef>(null);

  useEffect(() => {
    if (fetcher.state === "submitting") {
      isSubmitting.current = true;
      return;
    }

    if (isSubmitting.current && fetcher.state === "idle") {
      floatingLabelInputRef.current?.focus();
      isSubmitting.current = false;
      return;
    }
  }, [fetcher.state]);

  useEffect(() => {
    if (fetcher.type === "done") {
      floatingLabelInputRef.current?.clear();
    }
  }, [fetcher.type]);

  return { ref: floatingLabelInputRef, fetcher };
}
