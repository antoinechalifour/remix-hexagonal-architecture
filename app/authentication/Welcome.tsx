import { RocketIcon } from "@radix-ui/react-icons";
import { InfoPageTemplate } from "front/authentication/InfoPageTemplate";

export const Welcome = () => (
  <InfoPageTemplate title="You're almost there..." iconComponent={RocketIcon}>
    <p>
      A email containing a verification link has been sent to your address.
      You'll be ready when your account will be verified!
    </p>
  </InfoPageTemplate>
);
