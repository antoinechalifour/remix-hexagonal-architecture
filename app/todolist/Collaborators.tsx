import type { TodoListContributorsDto } from "shared/client";
import React from "react";
import { CollaboratorPin } from "front/todolist/CollaboratorPin";

export type CollaboratorsProps = { collaborators: TodoListContributorsDto[] };

export const Collaborators = ({ collaborators }: CollaboratorsProps) => (
  <ul className="flex space-x-2">
    {collaborators.map((collaborator) => (
      <li key={collaborator.id}>
        <CollaboratorPin label={collaborator.email}>
          {collaborator.shortName}
        </CollaboratorPin>
      </li>
    ))}
  </ul>
);
