import { Credentials } from "~/application/authentication/Credentials";

export class CredentialsEnvironmentRepository implements Credentials {
  isValid(username: string, password: string): Promise<boolean> {
    return Promise.resolve(
      username === process.env.AUTH_USERNAME &&
        password === process.env.AUTH_PASSWORD
    );
  }
}
