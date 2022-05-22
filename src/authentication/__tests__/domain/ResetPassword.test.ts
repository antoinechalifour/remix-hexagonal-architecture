import { Clock, FixedClock } from "shared/time";
import { Accounts } from "../../domain/Accounts";
import { PasswordHasher } from "../../domain/PasswordHasher";
import { ResetPassword } from "../../usecase/ResetPassword";
import { AccountsInMemory } from "./fakes/AccountsInMemory";
import { FakePasswordHasher } from "./fakes/FakePasswordHasher";
import { anAccountForgotPassword, aVerifiedAccount } from "./builders/Account";

describe("Resetting a password", () => {
  let resetPassword: ResetPassword;
  let passwordHasher: PasswordHasher;
  let clock: Clock;
  let accounts: Accounts;

  beforeEach(() => {
    accounts = new AccountsInMemory();
    passwordHasher = new FakePasswordHasher();
    clock = new FixedClock(new Date(new Date("2022-05-22T12:00:00.000Z")));
    resetPassword = new ResetPassword(accounts, passwordHasher, clock);
  });

  it("throws an error when the token is invalid", async () => {
    // Arrange
    const theEmail = "jane.doe@example.com";
    const theToken = "invalid-token";
    const theNewPassword = "the-new-password";
    const theAccount = anAccountForgotPassword()
      .forEmail(theEmail)
      .withPasswordResetToken("the-token")
      .withPasswordResetExpiration(new Date("2022-05-29T12:00:00.000Z"))
      .build();
    await accounts.save(theAccount);

    // Act
    const result = resetPassword.execute(theEmail, theToken, theNewPassword);

    // Assert
    await expect(result).rejects.toEqual(
      new Error("Invalid password reset token invalid-token")
    );
  });

  it("throws an error when the token is expired", async () => {
    // Arrange
    const theEmail = "jane.doe@example.com";
    const theToken = "the-token";
    const theNewPassword = "the-new-password";
    const theAccount = anAccountForgotPassword()
      .forEmail(theEmail)
      .withPasswordResetToken("the-token")
      .withPasswordResetExpiration(new Date("2022-05-22T11:59:00.000Z"))
      .build();
    await accounts.save(theAccount);

    // Act
    const result = resetPassword.execute(theEmail, theToken, theNewPassword);

    // Assert
    await expect(result).rejects.toEqual(
      new Error("Password reset token the-token is expired")
    );
  });

  it("resets the password when the token and expiration date are OK", async () => {
    // Arrange
    const theEmail = "jane.doe@example.com";
    const theToken = "some-valid-token";
    const theNewPassword = "the-new-password";
    const theAccount = anAccountForgotPassword()
      .forEmail(theEmail)
      .withPasswordResetToken(theToken)
      .withPasswordResetExpiration(new Date("2022-05-29T12:00:00.000Z"))
      .build();
    await accounts.save(theAccount);

    // Act
    await resetPassword.execute(theEmail, theToken, theNewPassword);

    // Assert
    expect(await accounts.verifiedAccountOfEmail(theEmail)).toEqual(
      aVerifiedAccount()
        .forEmail(theEmail)
        .usingPassword(theNewPassword)
        .build()
    );
  });
});
