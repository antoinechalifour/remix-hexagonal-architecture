import { CheckCircledIcon } from "@radix-ui/react-icons";
import { useVerifyAccount } from "front/authentication/useVerifyAccount";
import { InfoPageTemplate } from "front/authentication/InfoPageTemplate";

export const VerifyAccount = () => {
  useVerifyAccount();

  return (
    <InfoPageTemplate title="You're all set !" iconComponent={CheckCircledIcon}>
      <p>
        Your account has been verified. You'll be redirected to the app in a few
        seconds.
      </p>
    </InfoPageTemplate>
  );
};
