import type { ReactNode } from "react";

import React from "react";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Button } from "front/ui/Button";

export interface EditableContentDisplayModeProps {
  children: ReactNode;
  onEdit: () => void;
}

export const EditableContentDisplayMode = ({
  children,
  onEdit,
}: EditableContentDisplayModeProps) => (
  <div className="group flex items-center gap-4">
    <div>{children}</div>
    <Button
      className="opacity-0 transition group-focus-within:opacity-100 group-hover:opacity-100"
      aria-label="Edit"
      onClick={onEdit}
    >
      <Pencil1Icon height={18} width={18} />
    </Button>
  </div>
);
