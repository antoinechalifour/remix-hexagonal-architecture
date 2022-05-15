import React, { useRef, useState } from "react";
import { Button } from "front/ui/Button";
import classNames from "classnames";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";

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
          "max-w-prose overflow-x-auto rounded bg-transparent",
          inputClassName
        )}
        ref={inputRef}
        defaultValue={initialValue}
        onChange={onChange}
        size={size}
        name={inputName}
        autoFocus
        maxLength={50}
      />
      <Button onClick={onCancel}>
        <Cross1Icon width={15} height={15} />
      </Button>
      <Button type="submit">
        <CheckIcon width={18} height={18} />
      </Button>
    </div>
  );
};

function computeSize(content: string) {
  return Math.max(10, content.length);
}
