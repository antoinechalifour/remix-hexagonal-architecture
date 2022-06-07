import React from "react";
import classNames from "classnames";
import { colorFromString } from "front/palette";
import { Tooltip } from "front/ui/Tooltip";

export type CollaboratorPinProps = { children: string; label?: string };

export const CollaboratorPin = ({ children, label }: CollaboratorPinProps) => (
  <Tooltip.Provider delayDuration={200}>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <div
          className={classNames(
            "h-[25px] w-[25px] select-none rounded-full",
            "flex items-center justify-center",
            "font-mono text-xs font-bold uppercase",
            colorFromString(children)
          )}
        >
          {children}
        </div>
      </Tooltip.Trigger>

      {label != null && (
        <Tooltip.Content sideOffset={5}>
          <Tooltip.Arrow />

          {label}
        </Tooltip.Content>
      )}
    </Tooltip.Root>
  </Tooltip.Provider>
);
