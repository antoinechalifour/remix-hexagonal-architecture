import { Inject, Injectable } from "@nestjs/common";
import { AUTHENTICATOR } from "../../keys";
import { Authenticator } from "../domain/Authenticator";
import {
  AuthenticationStatusDto,
  FetchAuthenticationStatus,
} from "../domain/FetchAuthenticationStatus";

@Injectable()
export class FetchAuthenticationStatusSessionQuery
  implements FetchAuthenticationStatus
{
  constructor(
    @Inject(AUTHENTICATOR)
    private readonly authenticator: Authenticator
  ) {}

  async run(): Promise<AuthenticationStatusDto> {
    return {
      authenticated: await this.authenticator.isAuthenticated(),
    };
  }
}
