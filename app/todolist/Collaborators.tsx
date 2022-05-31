import type { TodoListContributorsDto } from "shared/client";
import React from "react";
import { CollaboratorPin } from "front/todolist/CollaboratorPin";
import { ShareButton } from "front/todolist/ShareButton";

export type CollaboratorsProps = {
  todoListId: string;
  collaborators: TodoListContributorsDto[];
};

export const Collaborators = ({
  todoListId,
  collaborators,
}: CollaboratorsProps) => (
  <ul className="flex space-x-2">
    {collaborators.map((collaborator) => (
      <li key={collaborator.id}>
        <CollaboratorPin label={collaborator.email}>
          {collaborator.shortName}
        </CollaboratorPin>
      </li>
    ))}

    <li>
      <ShareButton todoListId={todoListId} />
    </li>
  </ul>
);
