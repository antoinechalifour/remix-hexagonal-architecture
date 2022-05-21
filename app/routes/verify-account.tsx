import type { LoaderFunction, ThrownResponse } from "remix";
import type { RemixAppContext } from "web";
import { useCatch, useNavigate } from "remix";
import { PageTitle } from "front/ui/PageTitle";
import { useEffect } from "react";

export const loader: LoaderFunction = (args) =>
  (args.context as RemixAppContext).loaders.verifyAccount(args);

export default function VerifyAccount() {
  useVerifyAccount();

  return (
    <div className="my-10 space-y-6 text-center">
      <PageTitle>You're all set !</PageTitle>

      <p>
        Your account has been verified. You'll be redirected to the app in a
        fews seconds.
      </p>
    </div>
  );
}

export function CatchBoundary() {
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
}

function useVerifyAccount() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [navigate]);
}
