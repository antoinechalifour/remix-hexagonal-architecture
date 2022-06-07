import React from "react";
import { isEmpty } from "fp-ts/Array";
import { useContributors } from "front/todolist/state";
import { ContributorPin } from "front/todolist/Sharing/ContributorPin";
import { RevokeAccess } from "front/todolist/Sharing/RevokeAccess";

export const ManageContributors = () => {
  const contributors = useContributors();
  if (isEmpty(contributors)) return null;

  return (
    <div className="mb-4">
      <p>These people can contribute to this todo list :</p>
      <ul className="max-h-[300px] space-y-1 overflow-y-auto py-1 px-2">
        {contributors.map((contributor) => (
          <li
            className="flex items-center space-x-2 text-sm font-semibold"
            key={contributor.id}
          >
            <ContributorPin>{contributor.shortName}</ContributorPin>

            <span>{contributor.email}</span>

            <span className="text-xs text-faded">
              {" "}
              •{" "}
              {contributor.role === "contributor" ? (
                <RevokeAccess contributor={contributor} />
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
