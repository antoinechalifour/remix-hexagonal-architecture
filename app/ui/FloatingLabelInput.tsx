import type { ChangeEvent, HTMLProps, RefCallback } from "react";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import classNames from "classnames";

interface FloatingLabelInputProps {
  name: string;
  label: string;
  errorMessage?: string;
  inputProps: HTMLProps<HTMLInputElement>;
  inputRef?: RefCallback<HTMLInputElement>;
}

export type FloatingLabelInputRef = {
  focus: () => void;
  clear: () => void;
};

export const FloatingLabelInput = forwardRef<
  FloatingLabelInputRef,
  FloatingLabelInputProps
>(function FloatingLabelInput(props, ref) {
  const { name, label, errorMessage, inputProps } = props;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState("");
  const isStickyLabel = value.length > 0;

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => setValue(""),
  }));

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
  };

  return (
    <label className="group">
      <div className="relative">
        <input
          {...inputProps}
          ref={(node) => {
            inputRef.current = node;
            props.inputRef?.(node);
          }}
          name={name}
          value={value}
          onChange={handleChange}
          className={classNames(
            "block w-full rounded border bg-transparent px-4 pt-6 pb-2",
            "border-2 border",
            "text-base text-lighter transition-colors",
            {
              "border-dark focus:border-primary": !errorMessage,
              "border-danger": !!errorMessage,
            },
            inputProps.className
          )}
        />
        <span
          className={classNames(
            "absolute left-4 -translate-y-1/2 font-bold",
            "transition-all group-focus-within:top-4 group-focus-within:text-xs",
            {
              "top-1/2": !isStickyLabel,
              "top-4 text-xs": isStickyLabel,
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
});
