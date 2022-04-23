import { CredentialsEnvironmentRepository } from "../../../persistence/CredentialsEnvironmentRepository";
import { Credentials } from "../../../domain/Credentials";

describe("CredentialsEnvironnementRepository", () => {
  let originalEnvAuthUsername: string;
  let originalEnvAuthPassword: string;
  let credentials: Credentials;
  const authUsername = "johndoe";
  const authPassword = "azerty";

  beforeAll(() => {
    originalEnvAuthUsername = process.env.AUTH_USERNAME!;
    originalEnvAuthPassword = process.env.AUTH_PASSWORD!;
    process.env.AUTH_USERNAME = authUsername;
    process.env.AUTH_PASSWORD = authPassword;
  });

  beforeEach(() => {
    credentials = new CredentialsEnvironmentRepository();
  });

  it("should return whether the given credentials match the environment", async () => {
    expect(await credentials.isValid(authUsername, authPassword)).toBe(true);
    expect(await credentials.isValid("invalid-username", authPassword)).toBe(
      false
    );
    expect(await credentials.isValid(authUsername, "invalid-password")).toBe(
      false
    );
  });

  afterAll(() => {
    process.env.AUTH_USERNAME = originalEnvAuthUsername;
    process.env.AUTH_PASSWORD = originalEnvAuthPassword;
  });
});
