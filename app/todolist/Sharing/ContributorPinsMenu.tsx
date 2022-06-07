import React from "react";
import classNames from "classnames";
import { ContributorPin } from "front/todolist/Sharing/ContributorPin";
import { ShareButton } from "front/todolist/Sharing/ShareButton";
import { useContributors } from "front/todolist/state";

export type ContributorPinsMenuProps = {
  canShare: boolean;
  className?: string;
};

export const ContributorPinsMenu = ({
  canShare,
  className,
}: ContributorPinsMenuProps) => {
  const contributors = useContributors();

  return (
    <ul className={classNames("flex space-x-2", className)}>
      {contributors.map((contributor) => (
        <li key={contributor.id}>
          <ContributorPin label={contributor.email}>
            {contributor.shortName}
          </ContributorPin>
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
