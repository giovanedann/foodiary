import { InitiateAuthCommand, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";

import { cognitoClient } from "@infra/clients/cognito.client";
import { Injectable } from "@kernel/decorators/injectable";
import { AppConfig } from "src/@shared/config/app.config";

@Injectable()
export class AuthGateway {
  constructor(private readonly appConfig: AppConfig) {}

  async signUp({ email, password }: AuthGateway.SignUpParams): Promise<AuthGateway.SignUpResponse> {
    const signUpCommand = new SignUpCommand({
      ClientId: this.appConfig.auth.cognito.clientId,
      Username: email,
      Password: password,
    });

    const { UserSub } = await cognitoClient.send(signUpCommand);

    if (!UserSub) {
      throw new Error(`Failed to sign up user ${email}.`);
    }

    return {
      externalId: UserSub,
    };
  }

  async signIn({ email, password }: AuthGateway.SignInParams): Promise<AuthGateway.SignInResponse> {
    const signInCommand = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: this.appConfig.auth.cognito.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const { AuthenticationResult } = await cognitoClient.send(signInCommand);

    if (!AuthenticationResult?.AccessToken || !AuthenticationResult?.RefreshToken) {
      throw new Error(`Failed to authenticate user ${email}.`);
    }

    return {
      accessToken: AuthenticationResult.AccessToken,
      refreshToken: AuthenticationResult.RefreshToken,
    };
  }
}

export namespace AuthGateway {
  export type SignUpParams = {
    email: string;
    password: string;
  }

  export type SignUpResponse = {
    externalId: string;
  }

  export type SignInParams = {
    email: string;
    password: string;
  }

  export type SignInResponse = {
    accessToken: string;
    refreshToken: string;
  }
}
