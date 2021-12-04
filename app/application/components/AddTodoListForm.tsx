import { Form, useActionData, useTransition } from "remix";
import { AddTodoListErrors } from "~/domain/AddTodoListError";
import {
  FloatingLabelInput,
  links as floatingLabelInputLinks,
} from "../ui/FloatingLabelInput";
import { ButtonPrimary, links as buttonLinks } from "../ui/Button";
import { componentCss, link } from "../remix";
import css from "./AddTodoListForm.css";

export const links = componentCss(
  ...floatingLabelInputLinks(),
  ...buttonLinks(),
  link(css)
);

type ActionData = {
  errors?: AddTodoListErrors;
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
