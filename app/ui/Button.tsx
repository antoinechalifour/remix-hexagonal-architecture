import type { ButtonHTMLAttributes } from "react";

import classNames from "classnames";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  children,
  className,
  type = "button",
  ...props
}: ButtonProps) => (
  <button
    type={type}
    {...props}
    className={classNames(
      "text-sm font-semibold uppercase text-lighter disabled:cursor-not-allowed",
      className
    )}
  >
    {children}
  </button>
);

const CLASSES_COLORED_BUTTONS =
  "rounded-2xl py-2 px-4 sm:py-4 sm:px-6 shadow transition";

export const ButtonPrimary = ({
  children,
  className,
  ...props
}: ButtonProps) => (
  <Button
    {...props}
    className={classNames(
      CLASSES_COLORED_BUTTONS,
      "bg-primary  disabled:bg-primary-lighter",
      className
    )}
  >
    {children}
  </Button>
);

export const ButtonSecondary = ({
  children,
  className,
  ...props
}: ButtonProps) => (
  <Button
    {...props}
    className={classNames(
      CLASSES_COLORED_BUTTONS,
      "border-2 border-primary disabled:opacity-75",
      className
    )}
  >
    {children}
  </Button>
);
