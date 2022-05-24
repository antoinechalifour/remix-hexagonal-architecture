import type { ReactNode, ComponentType } from "react";
import type { IconProps } from "@radix-ui/react-icons/dist/types";
import { PageTitle } from "front/ui/PageTitle";

type InfoPageTemplateProps = {
  title: string;
  children: ReactNode;
  iconComponent: ComponentType<IconProps>;
};
export const InfoPageTemplate = ({
  title,
  children,
  iconComponent: Icon,
}: InfoPageTemplateProps) => (
  <div className="mt-8 space-y-6 text-center">
    <Icon className="mx-auto mb-12 opacity-30" width={250} height={250} />

    <PageTitle>{title}</PageTitle>

    {children}
  </div>
);
