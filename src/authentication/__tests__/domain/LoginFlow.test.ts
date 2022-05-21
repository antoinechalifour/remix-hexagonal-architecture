import { LoginFlow } from "../../usecase/LoginFlow";
import { InvalidCredentialsError } from "../../domain/InvalidCredentialsError";
import { AccountsInMemory } from "./fakes/AccountsInMemory";
import { FakePasswordHasher } from "./fakes/FakePasswordHasher";
import { aVerifiedAccount } from "./builders/Account";

describe("LoginFlow", () => {
  let passwordHasher: FakePasswordHasher;
  let accounts: AccountsInMemory;
  let loginFlow: LoginFlow;

  beforeEach(() => {
    passwordHasher = new FakePasswordHasher();
    accounts = new AccountsInMemory();
    loginFlow = new LoginFlow(accounts, passwordHasher);
  });

  it("returns an error when the account cannot be found", async () => {
    // Act
    const promise = loginFlow.execute("user-does-exist@example.com", "azerty");

    // Assert
    await expect(promise).rejects.toThrow(InvalidCredentialsError);
  });

  it("returns an error when the password is invalid", async () => {
    // Arrange
    await accounts.save(
      aVerifiedAccount()
        .forEmail("jane.doe@example.com")
        .usingPassword("jane_password")
        .build()
    );

    // Act
    const promise = loginFlow.execute("jane.doe@example.com", "wrong_password");

    // Assert
    await expect(promise).rejects.toThrow(InvalidCredentialsError);
  });

  it("returns the account id when credentials are valid", async () => {
    // Arrange
    const theAccount = aVerifiedAccount()
      .forEmail("jane.doe@example.com")
      .usingPassword("jane_password")
      .build();
    await accounts.save(theAccount);

    // Act
    const result = await loginFlow.execute(
      "jane.doe@example.com",
      "jane_password"
    );

    // Assert
    expect(result).toEqual(theAccount.id);
  });
});
