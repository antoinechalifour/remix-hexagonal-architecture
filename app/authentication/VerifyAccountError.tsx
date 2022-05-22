import type { ThrownResponse } from "remix";
import { useCatch } from "remix";
import { PageTitle } from "front/ui/PageTitle";

export const VerifyAccountError = () => {
  const error = useCatch<ThrownResponse<number, { message: string }>>();

  return (
    <div className="my-10 space-y-6 text-center">
      <PageTitle>Oupsie 💩</PageTitle>
      <p>
        An error occurred while verifying your account :{" "}
        <span className="font-semibold text-lighter">{error.data.message}</span>
        .
      </p>
    </div>
  );
};
