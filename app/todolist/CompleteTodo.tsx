import type { TodoDto } from "shared/client";
import React, { useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import { useOptimisticUpdates, useTodoListInfo } from "front/todolist/state";
import { CheckboxOption } from "front/ui/CheckboxOption";

export type CompleteTodoProps = { todo: TodoDto };

export const CompleteTodo = ({ todo }: CompleteTodoProps) => {
  const { id } = useTodoListInfo();
  const { completeTodoFetcher, handleChange } = useCompleteTodo(todo);

  return (
    <completeTodoFetcher.Form
      method="post"
      action={`/l/${id}/todo/${todo.id}`}
      onChange={handleChange}
      className="row-span-2 self-start md:row-span-1"
      replace
    >
      <CheckboxOption
        id={`todo-${todo.id}`}
        isChecked={todo.isComplete}
        label={<span className="sr-only">{todo.title} (click to toggle)</span>}
      />
    </completeTodoFetcher.Form>
  );
};

function useCompleteTodo(todo: TodoDto) {
  const completeTodoFetcher = useFetcher();
  const { markAsCompleted, markAsDoing } = useOptimisticUpdates();

  useEffect(() => {
    const submission = completeTodoFetcher.submission;
    if (submission == null) return;

    const isCheckedEntries = submission.formData.getAll("isChecked");
    if (isCheckedEntries.includes("on")) markAsCompleted(todo.id);
    else markAsDoing(todo.id);
  }, [completeTodoFetcher.submission, markAsCompleted, markAsDoing, todo.id]);

  const handleChange = (e: React.ChangeEvent<HTMLFormElement>) =>
    completeTodoFetcher.submit(e.currentTarget);

  return {
    completeTodoFetcher,
    handleChange,
  };
}
