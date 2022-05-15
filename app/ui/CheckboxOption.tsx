import React from "react";
import classNames from "classnames";

interface CheckboxOptionProps {
  id: string;
  isChecked: boolean;
  label: React.ReactNode;
}

export const CheckboxOption = ({
  id,
  isChecked,
  label,
}: CheckboxOptionProps) => (
  <label
    htmlFor={id}
    className="grid cursor-pointer grid-cols-[auto_1fr] items-center"
  >
    <input name="isChecked" type="hidden" value="off" />
    <input
      id={id}
      name="isChecked"
      type="checkbox"
      defaultChecked={isChecked}
      value="on"
      className={classNames(
        "relative inline-block h-5 w-5 border-none bg-transparent",
        "before:absolute before:block before:rounded-md",
        "before:-top-[3px] before:-left-px before:h-6 before:w-6",
        "before:cursor-pointer before:bg-darker before:transition-colors",
        "before:border-2 before:border-primary",
        "checked:before:bg-primary",
        "after:absolute after:z-10 after:block checked:after:content-['✓']",
        "checked:after:top-[53%] checked:after:left-[55%]",
        "checked:after:-translate-x-1/2 checked:after:-translate-y-1/2",
        "checked:after:cursor-pointer checked:after:text-lighter"
      )}
    />
    <span>{label}</span>
  </label>
);
