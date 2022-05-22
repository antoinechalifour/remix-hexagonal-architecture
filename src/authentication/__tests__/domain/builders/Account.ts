import {
  AccountForPasswordResetting,
  UnverifiedAccount,
  VerifiedAccount,
} from "../../../domain/Account";

interface VerifiedAccountBuilder {
  account: VerifiedAccount;
  forEmail(email: string): VerifiedAccountBuilder;
  usingPassword(password: string): VerifiedAccountBuilder;
  build(): VerifiedAccount;
}

export const aVerifiedAccount = (): VerifiedAccountBuilder => ({
  account: {
    type: "verified",
    id: "5719c982-060e-483d-9ade-bf4420b7273e",
    email: "john.doe@example.com",
    hash: "$2b$10$kcHThCk3LngaUT4JxSGlc.b4rkXZvoKAaYQsyBW6empf5bYwmHXgy", // Password is azerty :)
    verified: true,
  },
  forEmail(email: string): VerifiedAccountBuilder {
    this.account.email = email;
    return this;
  },
  usingPassword(password: string): VerifiedAccountBuilder {
    this.account.hash = password;
    return this;
  },
  build(): VerifiedAccount {
    return this.account;
  },
});

interface UnverifiedAccountBuilder {
  account: UnverifiedAccount;
  forEmail(email: string): UnverifiedAccountBuilder;
  withToken(token: string): UnverifiedAccountBuilder;
  build(): UnverifiedAccount;
}

export const aUnverifiedAccount = (): UnverifiedAccountBuilder => ({
  account: {
    type: "unverified",
    id: "5719c982-060e-483d-9ade-bf4420b7273e",
    email: "john.doe@example.com",
    hash: "$2b$10$kcHThCk3LngaUT4JxSGlc.b4rkXZvoKAaYQsyBW6empf5bYwmHXgy", // Password is azerty :)
    verified: false,
    verificationToken: "veirifcation-token",
  },
  forEmail(email: string): UnverifiedAccountBuilder {
    this.account.email = email;
    return this;
  },
  withToken(token: string): UnverifiedAccountBuilder {
    this.account.verificationToken = token;
    return this;
  },
  build(): UnverifiedAccount {
    return this.account;
  },
});

interface AccountForPasswordResettingBuilder {
  account: AccountForPasswordResetting;
  forEmail(email: string): AccountForPasswordResettingBuilder;
  withPasswordResetToken(token: string): AccountForPasswordResettingBuilder;
  withPasswordResetExpiration(date: Date): AccountForPasswordResettingBuilder;
  build(): AccountForPasswordResetting;
}

export const anAccountForPasswordResetting =
  (): AccountForPasswordResettingBuilder => ({
    account: {
      type: "password-reset",
      id: "5719c982-060e-483d-9ade-bf4420b7273e",
      email: "john.doe@example.com",
      passwordResetToken: "password-reset-token",
      passwordResetExpiration: new Date(),
    },
    forEmail(email: string): AccountForPasswordResettingBuilder {
      this.account.email = email;
      return this;
    },
    withPasswordResetToken(token: string): AccountForPasswordResettingBuilder {
      this.account.passwordResetToken = token;
      return this;
    },
    withPasswordResetExpiration(
      date: Date
    ): AccountForPasswordResettingBuilder {
      this.account.passwordResetExpiration = date;
      return this;
    },
    build(): AccountForPasswordResetting {
      return this.account;
    },
  });
