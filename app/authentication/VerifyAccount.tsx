import { PageTitle } from "front/ui/PageTitle";
import { useVerifyAccount } from "front/authentication/useVerifyAccount";

export const VerifyAccount = () => {
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
};
