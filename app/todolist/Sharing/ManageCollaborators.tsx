import React from "react";
import { isEmpty } from "fp-ts/Array";
import { useCollaborators } from "front/todolist/state";
import { CollaboratorPin } from "front/todolist/Sharing/CollaboratorPin";
import { RevokeCollaborator } from "front/todolist/Sharing/RevokeCollaborator";

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

            <span className="text-xs text-faded">
              {" "}
              •{" "}
              {collaborator.role === "collaborator" ? (
                <RevokeCollaborator collaborator={collaborator} />
              ) : (
                "Owner"
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
