import React, { useRef, useState } from "react";
import { Button } from "front/ui/Button";

export interface EditableContentEditionModeProps {
  inputName: string;
  initialValue: string;
  onCancel: () => void;
}

export const EditableContentEditionMode = ({
  inputName,
  initialValue,
  onCancel,
}: EditableContentEditionModeProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [size, setSize] = useState(computeSize(initialValue));

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSize(computeSize(e.target.value));

  return (
    <div className="flex gap-4">
      <input
        type="text"
        className="max-w-1/2 overflow-x-auto bg-transparent text-2xl font-semibold text-lighter"
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
