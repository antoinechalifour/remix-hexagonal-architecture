import type { ReactNode } from "react";
import React from "react";
import * as BaseDialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import classNames from "classnames";

type ContentProps = {
  title: string;
  children: ReactNode;
};
const Content = ({ children, title }: ContentProps) => (
  <BaseDialog.Portal>
    <BaseDialog.Overlay className="fixed inset-0 z-40 animate-enter bg-darker/50 backdrop-blur-sm" />
    <BaseDialog.Content
      className={classNames(
        "fixed top-40 left-1/2 z-50 w-11/12 max-w-md -translate-x-1/2 ",
        "animate-enter rounded bg-white p-4 text-inverse shadow"
      )}
    >
      <BaseDialog.Title className="mb-4 text-xl font-bold">
        {title}
      </BaseDialog.Title>
      <BaseDialog.Close className="absolute right-4 top-4">
        <Cross1Icon />
      </BaseDialog.Close>

      {children}
    </BaseDialog.Content>
  </BaseDialog.Portal>
);

export const Dialog = {
  ...BaseDialog,
  Content,
};
