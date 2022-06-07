import type { FloatingLabelInputRef } from "front/ui/FloatingLabelInput";
import React, { useEffect, useRef } from "react";
import { useFetcher } from "@remix-run/react";
import { FloatingLabelInput } from "front/ui/FloatingLabelInput";
import { ButtonPrimary } from "front/ui/Button";
import { useCollaborators, useTodoListInfo } from "front/todolist/state";
import { isEmpty } from "fp-ts/Array";

type ErrorReponse = {
  error: true;
  message: string;
};

export const ShareTodoListForm = () => {
  const shareTodoListFetcher = useFetcher<ErrorReponse | null>();
  const inputRef = useRef<FloatingLabelInputRef | null>(null);
  const { id } = useTodoListInfo();
  const collaborators = useCollaborators();

  useEffect(() => {
    if (shareTodoListFetcher.type !== "done") return;
    if (shareTodoListFetcher.data?.error) return;

    inputRef.current?.clear();
  }, [shareTodoListFetcher, shareTodoListFetcher.type]);

  return (
    <shareTodoListFetcher.Form
      action={`/l/${id}/share`}
      method="post"
      className="space-y-4"
    >
      {!isEmpty(collaborators) && (
        <div className="mb-4">
          <p>These people can collaborate on this todo list :</p>
          <ul className="space-y-1 py-1 px-2">
            {collaborators.map((collaborator) => (
              <li className="text-sm font-semibold" key={collaborator.id}>
                <span className="text-faded">•</span> {collaborator.email}
              </li>
            ))}
          </ul>
        </div>
      )}

      <hr />

      <p className="pb-1">Add someone else</p>

      <FloatingLabelInput
        name="email"
        label="Collaborator email"
        ref={inputRef}
        inputProps={{ type: "email", className: "text-inverse" }}
        errorMessage={shareTodoListFetcher.data?.message}
      />

      <ButtonPrimary type="submit" className="w-full">
        Share
      </ButtonPrimary>
    </shareTodoListFetcher.Form>
  );
};
