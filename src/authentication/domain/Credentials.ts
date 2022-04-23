export interface Credentials {
  isValid(username: string, password: string): Promise<boolean>;
}
