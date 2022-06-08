import React from "react";
import { ShareTodoListForm } from "front/todolist/Sharing/ShareTodoListForm";
import { ManageContributors } from "front/todolist/Sharing/ManageContributors";

export const ShareTodoListDialogContent = () => {
  return (
    <div className="space-y-4">
      <ManageContributors />
      <hr />
      <ShareTodoListForm />
    </div>
  );
};
