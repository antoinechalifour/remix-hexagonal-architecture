import type { AddTodoListErrorDto } from "shared";

import { Form, useActionData } from "remix";
import { FloatingLabelInput } from "front/ui/FloatingLabelInput";
import { AddTodoListButton } from "./AddTodoListButton";

type ActionData = {
  errors?: AddTodoListErrorDto;
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
