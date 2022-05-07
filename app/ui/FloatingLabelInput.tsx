import { useState } from "react";
import classNames from "classnames";

interface FloatingLabelInputOptions {
  name: string;
  label: string;
  errorMessage?: string;
  type?: string;
}

export const FloatingLabelInput = ({
  name,
  label,
  errorMessage,
  type = "text",
}: FloatingLabelInputOptions) => {
  const [value, setValue] = useState("");
  const isStickyLabel = value.length > 0;

  return (
    <label className="group">
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={classNames(
            "block w-full rounded-2xl border bg-transparent py-4 px-6",
            "border-2 border border-dark focus:border-primary",
            "text-base text-lighter transition-colors",
            {
              "border-danger": !!errorMessage,
            }
          )}
        />
        <span
          className={classNames(
            "absolute top-1/2 left-4 -translate-y-1/2 p-3 font-bold",
            "transition-all group-focus-within:top-0 group-focus-within:bg-darker group-focus-within:text-xs",
            {
              "top-0 bg-darker text-xs": isStickyLabel,
              "text-danger": !!errorMessage,
            }
          )}
        >
          {label}
        </span>
      </div>

      {errorMessage && (
        <span className="block px-4 pt-4 text-sm text-danger" role="alert">
          <span aria-hidden className="inline-block w-[2ch]">
            👉
          </span>{" "}
          {errorMessage}
        </span>
      )}
    </label>
  );
};
