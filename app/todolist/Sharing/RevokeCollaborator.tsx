import type { TodoListCollaboratorDto } from "shared/client";
import { useFetcher } from "@remix-run/react";
import { useTodoListInfo } from "front/todolist/state";
import { PlainButton } from "front/ui/Button";
import React from "react";

export const RevokeCollaborator = ({
  collaborator,
}: {
  collaborator: TodoListCollaboratorDto;
}) => {
  const revokeCollaboratorFetcher = useFetcher();
  const { id } = useTodoListInfo();

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
      className="underline"
      disabled={revokeCollaboratorFetcher.state !== "idle"}
    >
      Revoke
    </PlainButton>
  );
};
