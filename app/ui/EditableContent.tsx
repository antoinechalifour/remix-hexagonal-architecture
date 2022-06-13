import type { ReactElement } from "react";
import React, { useEffect, useState } from "react";
import { EditableContentEditionMode } from "front/ui/EditableContentEditionMode";
import { EditableContentDisplayMode } from "front/ui/EditableContentDisplayMode";

export interface EditableContentProps {
  children: ReactElement<{ className?: string }>;
  initialValue: string;
  inputName: string;
  disabled?: boolean;
  inputClassName?: string;
}

export const EditableContent = ({
  children,
  initialValue,
  inputName,
  disabled,
  inputClassName,
}: EditableContentProps) => {
  const { isEditionMode, switchToDisplayMode, switchToEditionMode } =
    useEditableContent(initialValue);

  if (isEditionMode && !disabled)
    return (
      <EditableContentEditionMode
        inputName={inputName}
        inputClassName={inputClassName}
        initialValue={initialValue}
        onCancel={switchToDisplayMode}
      />
    );

  return (
    <EditableContentDisplayMode
      readonly={disabled}
      onEdit={switchToEditionMode}
    >
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
