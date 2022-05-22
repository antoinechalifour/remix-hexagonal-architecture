import { GenerateTestId } from "shared/id";
import { FixedClock } from "shared/time";
import { ForgotPassword } from "../../usecase/ForgotPassword";
import { Accounts } from "../../domain/Accounts";
import { AccountsInMemory } from "./fakes/AccountsInMemory";
import { anAccountForgotPassword, aVerifiedAccount } from "./builders/Account";

describe("Forgot password", () => {
  let accounts: Accounts;
  let forgotPassword: ForgotPassword;

  beforeEach(() => {
    const generateId = new GenerateTestId("passwordResetCode");
    const clock = new FixedClock(new Date("2022-05-22T12:00:00.000Z"));
    accounts = new AccountsInMemory();
    forgotPassword = new ForgotPassword(accounts, generateId, clock);
  });

  it("generates the password reset token", async () => {
    // Arrange
    const theEmail = "john.doe@example.com";
    const theAccount = aVerifiedAccount().forEmail(theEmail).build();
    await accounts.save(theAccount);

    // Act
    await forgotPassword.execute("John.Doe@example.COM");

    // Arrange
    expect(await accounts.accountForgotPasswordOfEmail(theEmail)).toEqual(
      anAccountForgotPassword()
        .forEmail(theEmail)
        .withPasswordResetToken("passwordResetCode/1")
        .withPasswordResetExpiration(new Date("2022-05-29T12:00:00.000Z"))
        .build()
    );
  });
});
