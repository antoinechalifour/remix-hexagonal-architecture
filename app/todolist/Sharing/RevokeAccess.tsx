import type { TodoListContributorDto } from "shared/client";
import React from "react";
import { useFetcher } from "@remix-run/react";
import classNames from "classnames";
import { useTodoListInfo } from "front/todolist/state";
import { PlainButton } from "front/ui/Button";

export type RevokeAccessProps = { contributor: TodoListContributorDto };
export const RevokeAccess = ({ contributor }: RevokeAccessProps) => {
  const revokeAccessFetcher = useFetcher();
  const { id } = useTodoListInfo();
  const isBusy = revokeAccessFetcher.state !== "idle";

  const revoke = () => {
    const formData = new FormData();
    formData.append("contributorId", contributor.id);
    revokeAccessFetcher.submit(formData, {
      method: "post",
      action: `/l/${id}/revoke-access`,
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
