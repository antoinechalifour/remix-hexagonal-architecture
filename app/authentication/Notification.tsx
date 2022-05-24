import type { ReactNode } from "react";
import classNames from "classnames";

type NotificationProps = {
  level?: "info" | "error";
  children: ReactNode;
};

export const Notification = ({
  level = "info",
  children,
}: NotificationProps) => (
  <p
    className={classNames(
      "mb-4 rounded border-2 border-dashed p-4 font-bold text-inverse",
      {
        "border-danger bg-danger-lighter text-danger-darker": level === "error",
        "border-primary bg-primary-lighter text-primary-darker":
          level === "info",
      }
    )}
  >
    {children}
  </p>
);
