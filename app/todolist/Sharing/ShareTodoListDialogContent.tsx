import React from "react";
import { ShareTodoListForm } from "front/todolist/Sharing/ShareTodoListForm";
import { ManageCollaborators } from "front/todolist/Sharing/ManageCollaborators";

export const ShareTodoListDialogContent = () => {
  return (
    <div className="space-y-4">
      <ManageCollaborators />
      <hr />
      <ShareTodoListForm />
    </div>
  );
};
