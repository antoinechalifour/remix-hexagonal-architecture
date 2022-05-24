import type { ReactNode } from "react";
import { PageTitle } from "front/ui/PageTitle";

type FormCardProps = {
  title: string;
  children: ReactNode;
};

export const FormCard = ({ title, children }: FormCardProps) => (
  <div className="my-8 mx-auto max-w-md  rounded-lg bg-dark/30 p-8 shadow-xl">
    <PageTitle className="mb-6 text-center">{title}</PageTitle>

    {children}
  </div>
);
