import { useTransition } from "remix";
import { ButtonPrimary } from "front/ui/Button";

export interface AddTodoButtonProps {
  todoListId: string;
}

export const AddTodoButton = ({ todoListId }: AddTodoButtonProps) => {
  const transition = useTransition();
  const isSubmitting = transition.submission?.action === `/l/${todoListId}`;

  return <ButtonPrimary disabled={isSubmitting}>Done</ButtonPrimary>;
};
