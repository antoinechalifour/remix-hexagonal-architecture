import { Credentials } from "~/application/authentication/Credentials";

interface LoginFlowOptions {
  credentials: Credentials;
}

export type LoginResult = [Error, null] | [null, string];

export class LoginFlow {
  private readonly credentials;

  constructor({ credentials }: LoginFlowOptions) {
    this.credentials = credentials;
  }

  async execute(username: string, password: string): Promise<LoginResult> {
    const isValidCredentials = await this.credentials.isValid(
      username,
      password
    );

    if (!isValidCredentials)
      return [
        new Error(
          "Could not log you in. Make sure your credentials are valid."
        ),
        null,
      ];

    return [null, "user-1"];
  }
}
