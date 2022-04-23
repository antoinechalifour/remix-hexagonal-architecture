import { Credentials } from "../domain/Credentials";

export type LoginResult = [Error, null] | [null, string];

export class LoginFlow {
  constructor(private readonly credentials: Credentials) {}

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
