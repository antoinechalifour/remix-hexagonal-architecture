import type { ReactNode } from "react";
import React from "react";
import * as BaseDialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";

type ContentProps = {
  title: string;
  children: ReactNode;
};
const Content = ({ children, title }: ContentProps) => (
  <BaseDialog.Portal>
    <BaseDialog.Overlay className="fixed inset-0 bg-darker/75" />
    <BaseDialog.Content className="fixed top-40 left-1/2 w-11/12 max-w-md -translate-x-1/2  rounded bg-white p-4 text-inverse">
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
