import type { ButtonHTMLAttributes } from "react";

import classNames from "classnames";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, className, ...props }: ButtonProps) => (
  <button
    {...props}
    className={classNames(
      "text-sm font-semibold uppercase text-lighter disabled:cursor-not-allowed",
      className
    )}
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
      "rounded-2xl bg-primary py-4 px-6 shadow transition-colors disabled:bg-primary-lighter",
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
      "rounded-2xl border-2 border-primary py-4 px-6 shadow transition-colors",
      className
    )}
  >
    {children}
  </Button>
);
