import type { ReactNode } from "react";

import React from "react";
import { Button } from "front/ui/Button";

export interface EditableContentDisplayModeProps {
  children: ReactNode;
  onEdit: () => void;
}

export const EditableContentDisplayMode = ({
  children,
  onEdit,
}: EditableContentDisplayModeProps) => (
  <div className="group grid grid-cols-[auto_1fr] items-center gap-4">
    <div>{children}</div>
    <div className="opacity-0 transition group-hover:opacity-100">
      <Button aria-label="Edit" onClick={onEdit}>
        ✍️
      </Button>
    </div>
  </div>
);
