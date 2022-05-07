import { Form, useActionData, useTransition } from "remix";
import { AddTodoListErrorDto } from "shared";
import { FloatingLabelInput } from "../ui/FloatingLabelInput";
import { ButtonPrimary } from "../ui/Button";
import { componentCss, link } from "../stylesheet";
import css from "./AddTodoListForm.css";

export const links = componentCss(link(css));

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
    <Form method="post" className="AddTodoListForm">
      <FloatingLabelInput
        name="title"
        label="Add a new todo list"
        errorMessage={actionData?.errors?.title}
      />

      <AddTodoListButton />
    </Form>
  );
};
