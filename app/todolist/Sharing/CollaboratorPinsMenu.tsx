import React from "react";
import classNames from "classnames";
import { CollaboratorPin } from "front/todolist/Sharing/CollaboratorPin";
import { ShareButton } from "front/todolist/Sharing/ShareButton";
import { useCollaborators } from "front/todolist/state";

export type CollaboratorPinsMenuProps = {
  canShare: boolean;
  className?: string;
};

export const CollaboratorPinsMenu = ({
  canShare,
  className,
}: CollaboratorPinsMenuProps) => {
  const collaborators = useCollaborators();

  return (
    <ul className={classNames("flex space-x-2", className)}>
      {collaborators.map((collaborator) => (
        <li key={collaborator.id}>
          <CollaboratorPin label={collaborator.email}>
            {collaborator.shortName}
          </CollaboratorPin>
        </li>
      ))}

      {canShare && (
        <li>
          <ShareButton />
        </li>
      )}
    </ul>
  );
};
