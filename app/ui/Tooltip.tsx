import type { TooltipContentProps } from "@radix-ui/react-tooltip";
import * as BaseTooltip from "@radix-ui/react-tooltip";
import classNames from "classnames";

const Arrow = () => (
  <BaseTooltip.Arrow fill="currentColor" className="text-white" />
);

const Content = ({ children, className, ...props }: TooltipContentProps) => (
  <BaseTooltip.Content
    className={classNames(
      "rounded bg-white py-1 px-2 font-mono text-xs text-dark shadow",
      "animate-scale-in",
      className
    )}
    {...props}
  >
    {children}
  </BaseTooltip.Content>
);

export const Tooltip = {
  ...BaseTooltip,
  Arrow,
  Content,
};
