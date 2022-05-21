import type { MetaFunction } from "remix";
import { PageTitle } from "front/ui/PageTitle";

export const meta: MetaFunction = () => ({
  title: "TLM | Welcome",
});

export default function Welcome() {
  return (
    <div className="my-6 space-y-6 text-center">
      <PageTitle>You're almost there...</PageTitle>

      <p>
        A email containing a verification link has been sent to your address.
        You'll be ready when your account will be verified!
      </p>
    </div>
  );
}
