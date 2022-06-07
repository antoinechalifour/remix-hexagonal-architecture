import React from "react";
import { isEmpty } from "fp-ts/Array";
import { useCollaborators } from "front/todolist/state";
import { CollaboratorPin } from "front/todolist/Sharing/CollaboratorPin";
import { PlainButton } from "front/ui/Button";

export const ManageCollaborators = () => {
  const collaborators = useCollaborators();
  if (isEmpty(collaborators)) return null;

  return (
    <div className="mb-4">
      <p>These people can collaborate on this todo list :</p>
      <ul className="space-y-1 py-1 px-2">
        {collaborators.map((collaborator) => (
          <li
            className="flex items-center space-x-2 text-sm font-semibold"
            key={collaborator.id}
          >
            <CollaboratorPin>{collaborator.shortName}</CollaboratorPin>

            <span>{collaborator.email}</span>

            {collaborator.role === "collaborator" && (
              <span className="text-xs text-faded">
                {" "}
                • <PlainButton className="underline">Revoke</PlainButton>
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
