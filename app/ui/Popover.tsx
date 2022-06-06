import type { ReactNode } from "react";
import type { PopoverContentProps } from "@radix-ui/react-popover";
import React from "react";
import * as BasePopover from "@radix-ui/react-popover";
import classNames from "classnames";

export type ContentProps = PopoverContentProps;
export const Content = ({ children, ...props }: ContentProps) => (
  <BasePopover.Content
    {...props}
    className="min-w-[220px] rounded bg-lighter py-2 text-inverse shadow"
  >
    {children}
  </BasePopover.Content>
);

export type ItemProps = { children: ReactNode; className?: string };
export const Item = ({ children, className }: ItemProps) => (
  <div className={classNames("px-3 py-1 text-xs", className)}>{children}</div>
);

export type LabelProps = { children: ReactNode; className?: string };
export const SectionTitle = ({ children, className }: LabelProps) => (
  <p className={classNames("px-3 py-1 text-sm font-semibold", className)}>
    {children}
  </p>
);

export const Separator = () => (
  <div
    role="separator"
    aria-orientation="horizontal"
    className="mx-1 my-2 h-px bg-gray-200"
  />
);

export const Arrow = () => <BasePopover.Arrow fill="white" offset={10} />;

export const Popover = {
  ...BasePopover,
  Content,
  Item,
  SectionTitle,
  Separator,
  Arrow,
};
