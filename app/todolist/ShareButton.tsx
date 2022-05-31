import React from "react";
import classNames from "classnames";
import * as BaseDialog from "@radix-ui/react-dialog";
import { Cross1Icon, PlusIcon } from "@radix-ui/react-icons";
import { ShareTodoListForm } from "front/todolist/ShareTodoListForm";

export type ShareButtonProps = { todoListId: string };

export const ShareButton = ({ todoListId }: ShareButtonProps) => {
  return (
    <BaseDialog.Root>
      <BaseDialog.Trigger asChild>
        <button
          className={classNames(
            "h-[25px] w-[25px] select-none rounded-full",
            "flex items-center justify-center",
            "bg-white font-mono text-xs font-bold uppercase"
          )}
          type="button"
          aria-label="Add collaborator"
        >
          <PlusIcon fill="currentColor" className="text-inverse" />
        </button>
      </BaseDialog.Trigger>

      <BaseDialog.Portal>
        <BaseDialog.Overlay className="fixed inset-0 bg-darker/75" />
        <BaseDialog.Content className="fixed top-40 left-1/2 w-11/12 max-w-md -translate-x-1/2  rounded bg-white p-4 text-inverse">
          <BaseDialog.Title className="font-lg mb-4 font-bold">
            Share this todo list
          </BaseDialog.Title>
          <ShareTodoListForm todoListId={todoListId} />
          <BaseDialog.Close className="absolute right-4 top-4">
            <Cross1Icon />
          </BaseDialog.Close>
        </BaseDialog.Content>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
};
