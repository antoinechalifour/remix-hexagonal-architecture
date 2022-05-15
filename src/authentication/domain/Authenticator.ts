export interface CurrentUser {
  id: string;
  sessionId: string;
}

export interface Authenticator {
  isAuthenticated(): Promise<boolean>;
  currentUser(): Promise<CurrentUser>;
}
