export type AuthenticationStatusDto = {
  authenticated: boolean;
};

export interface FetchAuthenticationStatus {
  run(): Promise<AuthenticationStatusDto>;
}
