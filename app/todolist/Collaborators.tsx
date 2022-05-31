import type { TodoListCollaboratorDto } from "shared/client";
import React from "react";
import { CollaboratorPin } from "front/todolist/CollaboratorPin";
import { ShareButton } from "front/todolist/ShareButton";
import classNames from "classnames";

export type CollaboratorsProps = {
  todoListId: string;
  collaborators: TodoListCollaboratorDto[];
  className?: string;
};

export const Collaborators = ({
  todoListId,
  collaborators,
  className,
}: CollaboratorsProps) => (
  <ul className={classNames("flex space-x-2", className)}>
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
