import type { ButtonHTMLAttributes } from "react";

import classNames from "classnames";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, className, ...props }: ButtonProps) => (
  <button
    {...props}
    className={classNames("disabled:cursor-not-allowed", className)}
  >
    {children}
  </button>
);

export const ButtonPrimary = ({
  children,
  className,
  ...props
}: ButtonProps) => (
  <Button
    {...props}
    className={classNames(
      "rounded-2xl bg-primary py-4 px-6 shadow transition-colors disabled:bg-primary-light",
      "text-sm font-semibold uppercase text-white text-text-secondary"
    )}
  >
    {children}
  </Button>
);
