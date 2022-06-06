import type { ThrownResponse } from "@remix-run/react";
import { useCatch } from "@remix-run/react";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { InfoPageTemplate } from "front/authentication/InfoPageTemplate";

export const VerifyAccountError = () => {
  const error = useCatch<ThrownResponse<number, { message: string }>>();

  return (
    <InfoPageTemplate title="Oupsie 🙈" iconComponent={CrossCircledIcon}>
      <p>
        An error occurred while verifying your account :{" "}
        <span className="font-semibold text-lighter">{error.data.message}</span>
        .
      </p>
    </InfoPageTemplate>
  );
};
