import type { ButtonHTMLAttributes } from "react";

import classNames from "classnames";
import { componentCss, link } from "~/application/remix/styling";
import css from "./Button.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const links = componentCss(link(css));

export const Button = ({ children, className, ...props }: ButtonProps) => (
  <button
    {...props}
    className={classNames("Button", "Button--reset", className)}
  >
    {children}
  </button>
);

export const ButtonPrimary = ({
  children,
  className,
  ...props
}: ButtonProps) => (
  <Button {...props} className={classNames("Button--primary", className)}>
    {children}
  </Button>
);
