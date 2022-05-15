import React, { useRef, useState } from "react";
import { Button } from "front/ui/Button";
import classNames from "classnames";

export interface EditableContentEditionModeProps {
  inputName: string;
  initialValue: string;
  onCancel: () => void;
  inputClassName?: string;
}

export const EditableContentEditionMode = ({
  inputName,
  initialValue,
  onCancel,
  inputClassName,
}: EditableContentEditionModeProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [size, setSize] = useState(computeSize(initialValue));

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSize(computeSize(e.target.value));

  return (
    <div className="flex gap-4">
      <input
        type="text"
        className={classNames(
          "max-w-1/2 overflow-x-auto rounded bg-transparent",
          inputClassName
        )}
        ref={inputRef}
        defaultValue={initialValue}
        onChange={onChange}
        size={size}
        name={inputName}
        autoFocus
      />
      <Button type="submit">✅</Button>
      <Button onClick={onCancel}>❌</Button>
    </div>
  );
};

function computeSize(content: string) {
  return Math.max(10, content.length);
}
