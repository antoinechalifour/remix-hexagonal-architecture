import type { ReactElement } from "react";
import React, { useEffect, useState } from "react";
import { EditableContentEditionMode } from "front/ui/EditableContentEditionMode";
import { EditableContentDisplayMode } from "front/ui/EditableContentDisplayMode";

export interface EditableContentProps {
  children: ReactElement<{ className?: string }>;
  initialValue: string;
  inputName: string;
}

export const EditableContent = ({
  children,
  initialValue,
  inputName,
}: EditableContentProps) => {
  const { isEditionMode, switchToDisplayMode, switchToEditionMode } =
    useEditableContent(initialValue);

  if (isEditionMode)
    return (
      <EditableContentEditionMode
        inputName={inputName}
        initialValue={initialValue}
        onCancel={switchToDisplayMode}
      />
    );

  return (
    <EditableContentDisplayMode onEdit={switchToEditionMode}>
      {children}
    </EditableContentDisplayMode>
  );
};

function useEditableContent(initialValue: string) {
  const [isEditionMode, setEditionMode] = useState(false);

  useEffect(() => {
    setEditionMode(false);
  }, [initialValue]);

  return {
    isEditionMode,
    switchToEditionMode: () => setEditionMode(true),
    switchToDisplayMode: () => setEditionMode(false),
  };
}
