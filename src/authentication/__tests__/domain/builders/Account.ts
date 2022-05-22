import {
  AccountForgotPassword,
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

interface AccountForgotPasswordBuilder {
  account: AccountForgotPassword;
  forEmail(email: string): AccountForgotPasswordBuilder;
  withPasswordResetToken(token: string): AccountForgotPasswordBuilder;
  withPasswordResetExpiration(date: Date): AccountForgotPasswordBuilder;
  build(): AccountForgotPassword;
}

export const anAccountForgotPassword = (): AccountForgotPasswordBuilder => ({
  account: {
    type: "forgot-password",
    id: "5719c982-060e-483d-9ade-bf4420b7273e",
    email: "john.doe@example.com",
    passwordResetToken: "password-reset-token",
    passwordResetExpiration: new Date(),
  },
  forEmail(email: string): AccountForgotPasswordBuilder {
    this.account.email = email;
    return this;
  },
  withPasswordResetToken(token: string): AccountForgotPasswordBuilder {
    this.account.passwordResetToken = token;
    return this;
  },
  withPasswordResetExpiration(date: Date): AccountForgotPasswordBuilder {
    this.account.passwordResetExpiration = date;
    return this;
  },
  build(): AccountForgotPassword {
    return this.account;
  },
});
