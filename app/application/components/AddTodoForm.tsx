import { Form, useActionData, useTransition } from "remix";
import { AddTodoErrors } from "~/domain/AddTodoError";
import {
  FloatingLabelInput,
  links as floatingLabelInputLinks,
} from "../ui/FloatingLabelInput";
import { ButtonPrimary, links as buttonLinks } from "../ui/Button";
import { componentCss, link } from "../remix";
import css from "./AddTodoForm.css";

export const links = componentCss(
  ...floatingLabelInputLinks(),
  ...buttonLinks(),
  link(css)
);

type ActionData = {
  errors?: AddTodoErrors;
};

interface AddTodoButton {
  todoListId: string;
}

const AddTodoButton = ({ todoListId }: AddTodoButton) => {
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
    <Form method="post" replace className="AddTodoForm">
      <FloatingLabelInput
        label="What needs to be done?"
        name="todoTitle"
        errorMessage={actionData?.errors?.todoTitle}
      />

      <AddTodoButton todoListId={todoListId} />
    </Form>
  );
};
