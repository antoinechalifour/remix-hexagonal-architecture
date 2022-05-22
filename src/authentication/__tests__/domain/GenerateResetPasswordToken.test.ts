import { GenerateResetPasswordToken } from "../../usecase/GenerateResetPasswordToken";
import { AccountsInMemory } from "./fakes/AccountsInMemory";
import {
  anAccountForPasswordResetting,
  aVerifiedAccount,
} from "./builders/Account";
import { GenerateTestId } from "shared/id";
import { FixedClock } from "shared/time";

describe("Preparing an account for resetting its password", () => {
  let accounts: AccountsInMemory;
  let generateResetPasswordToken: GenerateResetPasswordToken;

  beforeEach(() => {
    const generateId = new GenerateTestId("passwordResetCode");
    const clock = new FixedClock(new Date("2022-05-22T12:00:00.000Z"));
    accounts = new AccountsInMemory();
    generateResetPasswordToken = new GenerateResetPasswordToken(
      accounts,
      generateId,
      clock
    );
  });

  it("generates the password reset token", async () => {
    // Arrange
    const theEmail = "john.doe@example.com";
    const theAccount = aVerifiedAccount().forEmail(theEmail).build();
    await accounts.save(theAccount);

    // Act
    await generateResetPasswordToken.execute(theEmail);

    // Arrange
    expect(await accounts.accountForPasswordResettingOfEmail(theEmail)).toEqual(
      anAccountForPasswordResetting()
        .forEmail(theEmail)
        .withPasswordResetToken("passwordResetCode/1")
        .withPasswordResetExpiration(new Date("2022-05-29T12:00:00.000Z"))
        .build()
    );
  });
});
