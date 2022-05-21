import type { Accounts } from "../../domain/Accounts";
import type { VerifiedAccount } from "../../domain/Account";
import type { PasswordHasher } from "../../domain/PasswordHasher";
import { LoginFlow } from "../../usecase/LoginFlow";
import { InvalidCredentialsError } from "../../domain/InvalidCredentialsError";

interface AccountBuilder {
  account: VerifiedAccount;
  forEmail(email: string): AccountBuilder;
  usingPassword(password: string): AccountBuilder;
  build(): VerifiedAccount;
}

const anAccount = (): AccountBuilder => ({
  account: {
    id: "5719c982-060e-483d-9ade-bf4420b7273e",
    email: "john.doe@example.com",
    hash: "$2b$10$kcHThCk3LngaUT4JxSGlc.b4rkXZvoKAaYQsyBW6empf5bYwmHXgy", // Password is azerty :)
    verified: true,
  },
  forEmail(email: string): AccountBuilder {
    this.account.email = email;
    return this;
  },
  usingPassword(password: string): AccountBuilder {
    this.account.hash = password;
    return this;
  },
  build(): VerifiedAccount {
    return this.account;
  },
});

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
      anAccount()
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
    const theAccount = anAccount()
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

class AccountsInMemory implements Accounts {
  private _database = new Map<string, VerifiedAccount>();

  async verifiedAccountOfEmail(email: string): Promise<VerifiedAccount> {
    const account = this._database.get(email);

    if (!account) throw new InvalidCredentialsError("Account not found");

    return account;
  }

  async save(account: VerifiedAccount): Promise<void> {
    this._database.set(account.email, account);
  }
}

class FakePasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    return password;
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return password === hash;
  }
}
