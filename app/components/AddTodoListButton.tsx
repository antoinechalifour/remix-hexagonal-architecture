import { useTransition } from "remix";
import { ButtonPrimary } from "front/ui/Button";

export const AddTodoListButton = () => {
  const transition = useTransition();
  const isSubmitting = transition.submission?.action === "/?index";

  return <ButtonPrimary disabled={isSubmitting}>Done</ButtonPrimary>;
};
