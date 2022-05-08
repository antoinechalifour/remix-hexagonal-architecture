import type { AddTodoErrorDto } from "shared";
import { Form, useActionData, useTransition } from "remix";
import { FloatingLabelInput } from "../ui/FloatingLabelInput";
import { ButtonPrimary } from "../ui/Button";

type ActionData = {
  errors?: AddTodoErrorDto;
};

interface AddTodoButtonProps {
  todoListId: string;
}

const AddTodoButton = ({ todoListId }: AddTodoButtonProps) => {
  const transition = useTransition();
  const isSubmitting = transition.submission?.action === `/l/${todoListId}`;

  return <ButtonPrimary disabled={isSubmitting}>Done</ButtonPrimary>;
};

interface AddTodoFormProps {
  todoListId: string;
}

export const AddTodoForm = ({ todoListId }: AddTodoFormProps) => {
  const actionData = useActionData<ActionData>();

  return (
    <Form
      method="post"
      replace
      className="grid grid-cols-[1fr_auto] items-center gap-5"
    >
      <FloatingLabelInput
        label="What needs to be done?"
        name="todoTitle"
        errorMessage={actionData?.errors?.todoTitle}
      />

      <AddTodoButton todoListId={todoListId} />
    </Form>
  );
};
