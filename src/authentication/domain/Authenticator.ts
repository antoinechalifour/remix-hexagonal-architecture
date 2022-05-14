export interface Authenticator {
  isAuthenticated(): Promise<boolean>;
  currentUser(): Promise<string>;
}
