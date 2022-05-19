import type { CheckedState } from "@radix-ui/react-checkbox";
import React, { useState } from "react";
import classNames from "classnames";
import { CheckIcon } from "@radix-ui/react-icons";
import * as Checkbox from "@radix-ui/react-checkbox";

interface CheckboxOptionProps {
  id: string;
  isChecked: boolean;
  label: React.ReactNode;
}

export const CheckboxOption = ({
  id,
  isChecked,
  label,
}: CheckboxOptionProps) => {
  const [checked, setChecked] = useState<CheckedState>(isChecked);

  return (
    <div>
      <input name="isChecked" type="hidden" value="off" />
      <Checkbox.Root
        defaultChecked={isChecked}
        checked={checked}
        onCheckedChange={setChecked}
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
