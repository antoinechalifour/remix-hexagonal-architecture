import { VerifyAccount } from "../../usecase/VerifyAccount";
import { AccountsInMemory } from "./fakes/AccountsInMemory";
import { aUnverifiedAccount, aVerifiedAccount } from "./builders/Account";
import { InvalidVerificationTokenError } from "../../domain/InvalidVerificationTokenError";

describe("Verifying an account", () => {
  it("verifies the account when the token is valid", async () => {
    // Arrange
    const accounts = new AccountsInMemory();
    const verifyAccount = new VerifyAccount(accounts);
    const theAccount = aUnverifiedAccount()
      .forEmail("john.doe@example.com")
      .withToken("john-token")
      .build();
    await accounts.save(theAccount);

    // Act
    await verifyAccount.execute(theAccount.email, theAccount.verificationToken);

    // Assert
    expect(await accounts.verifiedAccountOfEmail(theAccount.email)).toEqual(
      aVerifiedAccount().forEmail(theAccount.email).build()
    );
  });

  it("throws an error when the token is invalid", async () => {
    // Arrange
    const accounts = new AccountsInMemory();
    const verifyAccount = new VerifyAccount(accounts);
    const theAccount = aUnverifiedAccount()
      .forEmail("john.doe@example.com")
      .withToken("john-token")
      .build();
    await accounts.save(theAccount);

    // Act
    const result = verifyAccount.execute(
      theAccount.email,
      "some invalid token"
    );

    // Assert
    await expect(result).rejects.toEqual(
      new InvalidVerificationTokenError("some invalid token")
    );
  });
});
