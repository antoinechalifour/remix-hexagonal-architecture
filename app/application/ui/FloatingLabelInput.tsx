import { useState } from "react";
import classNames from "classnames";
import { componentCss, link } from "../remix";
import css from "./FloatingLabelInput.css";

export const links = componentCss(link(css));

interface FloatingLabelInputOptions {
  name: string;
  label: string;
  errorMessage?: string;
}

export const FloatingLabelInput = ({
  name,
  label,
  errorMessage,
}: FloatingLabelInputOptions) => {
  const [value, setValue] = useState("");
  const isStickyLabel = value.length > 0;

  return (
    <label className="FloatingLabelInput">
      <input
        type="text"
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <span
        className={classNames("FloatingLabelInput__label", {
          "FloatingLabelInput__label--sticky": isStickyLabel,
        })}
      >
        {label}
      </span>

      {errorMessage && (
        <span className="FloatingLabelInput__error" role="alert">
          👉 {errorMessage}
        </span>
      )}
    </label>
  );
};
