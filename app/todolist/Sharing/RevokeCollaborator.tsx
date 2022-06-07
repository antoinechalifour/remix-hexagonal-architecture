import type { TodoListCollaboratorDto } from "shared/client";
import React from "react";
import { useFetcher } from "@remix-run/react";
import classNames from "classnames";
import { useTodoListInfo } from "front/todolist/state";
import { PlainButton } from "front/ui/Button";

export const RevokeCollaborator = ({
  collaborator,
}: {
  collaborator: TodoListCollaboratorDto;
}) => {
  const revokeCollaboratorFetcher = useFetcher();
  const { id } = useTodoListInfo();
  const isBusy = revokeCollaboratorFetcher.state !== "idle";

  const revoke = () => {
    const formData = new FormData();
    formData.append("collaboratorId", collaborator.id);
    revokeCollaboratorFetcher.submit(formData, {
      method: "post",
      action: `/l/${id}/unshare`,
    });
  };

  return (
    <PlainButton
      onClick={revoke}
      className={classNames({
        underline: !isBusy,
      })}
      disabled={isBusy}
    >
      {isBusy ? "Revoking..." : "Revoke"}
    </PlainButton>
  );
};
