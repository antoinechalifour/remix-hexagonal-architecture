import type { AddTodoListErrorDto } from "shared";
import { Form, useActionData, useTransition } from "remix";
import { FloatingLabelInput } from "../ui/FloatingLabelInput";
import { ButtonPrimary } from "../ui/Button";

type ActionData = {
  errors?: AddTodoListErrorDto;
};

const AddTodoListButton = () => {
  const transition = useTransition();
  const isSubmitting = transition.submission?.action === "/?index";

  return <ButtonPrimary disabled={isSubmitting}>Done</ButtonPrimary>;
};

export const AddTodoListForm = () => {
  const actionData = useActionData<ActionData>();

  return (
    <Form
      method="post"
      className="grid grid-cols-[1fr_auto] items-center gap-5"
    >
      <FloatingLabelInput
        name="title"
        label="Add a new todo list"
        errorMessage={actionData?.errors?.title}
      />

      <AddTodoListButton />
    </Form>
  );
};
