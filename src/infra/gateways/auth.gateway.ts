import { createHmac } from "node:crypto";

import { InitiateAuthCommand, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";

import { cognitoClient } from "@infra/clients/cognito.client";
import { Injectable } from "@kernel/decorators/injectable";
import { AppConfig } from "src/@shared/config/app.config";

@Injectable()
export class AuthGateway {
  constructor(private readonly appConfig: AppConfig) {}

  async signUp({ email, password }: AuthGateway.SignUpParams): Promise<AuthGateway.SignUpResult> {
    const signUpCommand = new SignUpCommand({
      ClientId: this.appConfig.auth.cognito.client.id,
      Username: email,
      Password: password,
      SecretHash: this.getSecretHash({ email }),
    });

    const { UserSub } = await cognitoClient.send(signUpCommand);

    if (!UserSub) {
      throw new Error(`Failed to sign up user ${email}.`);
    }

    return {
      externalId: UserSub,
    };
  }

  async signIn({ email, password }: AuthGateway.SignInParams): Promise<AuthGateway.SignInResult> {
    const signInCommand = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: this.appConfig.auth.cognito.client.id,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: this.getSecretHash({ email }),
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

  private getSecretHash({ email }: AuthGateway.GetSecretHashParams): AuthGateway.GetSecretHashResult {
    const { id, secret } = this.appConfig.auth.cognito.client;

    const hash = createHmac("SHA256", secret)
        .update(`${email}${id}`)
        .digest("base64");

    return hash;
  }
}

export namespace AuthGateway {
  export type SignUpParams = {
    email: string;
    password: string;
  }

  export type SignUpResult = {
    externalId: string;
  }

  export type SignInParams = {
    email: string;
    password: string;
  }

  export type SignInResult = {
    accessToken: string;
    refreshToken: string;
  }

  export type GetSecretHashParams = {
    email: string;
  }

  export type GetSecretHashResult = string
}
