import React from "react";
import { componentCss, link } from "~/application/remix/styling";
import css from "./CheckboxOption.css";

export const links = componentCss(link(css));

interface CheckboxOptionProps {
  id: string;
  isChecked: boolean;
  label: string;
}

export const CheckboxOption = ({
  id,
  isChecked,
  label,
}: CheckboxOptionProps) => (
  <label htmlFor={id} className="CheckboxOption">
    <input
      id={id}
      name="isChecked"
      type="checkbox"
      defaultChecked={isChecked}
    />
    <span>{label}</span>
  </label>
);
