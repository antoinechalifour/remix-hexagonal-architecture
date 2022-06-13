import type { CheckedState } from "@radix-ui/react-checkbox";
import React, { useState } from "react";
import classNames from "classnames";
import { CheckIcon } from "@radix-ui/react-icons";
import * as Checkbox from "@radix-ui/react-checkbox";

interface CheckboxOptionProps {
  id: string;
  checked: boolean;
  label: React.ReactNode;
  disabled?: boolean;
}

export const CheckboxOption = ({
  id,
  checked: initialChecked,
  label,
  disabled,
}: CheckboxOptionProps) => {
  const [checked, setChecked] = useState<CheckedState>(initialChecked);

  return (
    <div>
      <input name="isChecked" type="hidden" value="off" />
      <Checkbox.Root
        defaultChecked={checked}
        checked={checked}
        onCheckedChange={setChecked}
        disabled={disabled}
        id={id}
        value="on"
        name="isChecked"
        className={classNames(
          "inline-block h-6 w-6 rounded-md transition-colors",
          "flex items-center justify-center",
          "border-2 border-primary",
          {
            "bg-darker": !checked,
            "bg-primary": checked,
            "cursor-not-allowed": disabled,
          }
        )}
      >
        <Checkbox.Indicator>
          {checked && (
            <CheckIcon className="text-lighter" fill="currentColor" />
          )}
        </Checkbox.Indicator>
      </Checkbox.Root>

      <label htmlFor={id}>{label}</label>
    </div>
  );
};
