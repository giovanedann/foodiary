import { createHmac } from "node:crypto";

import {
  ConfirmForgotPasswordCommand,
  ForgotPasswordCommand,
  GetTokensFromRefreshTokenCommand,
  InitiateAuthCommand,
  RefreshTokenReuseException,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { InvalidRefreshTokenError } from "@application/errors/application/invalid-refresh-token.error";
import { cognitoClient } from "@infra/clients/cognito.client";
import { Injectable } from "@kernel/decorators/injectable";
import { AppConfig } from "@shared/config/app.config";

@Injectable()
export class AuthGateway {
  constructor(private readonly appConfig: AppConfig) {}

  async signUp({
    email,
    password,
    internalId,
  }: AuthGateway.SignUpParams): Promise<AuthGateway.SignUpResult> {
    const signUpCommand = new SignUpCommand({
      ClientId: this.appConfig.auth.cognito.client.id,
      Username: email,
      Password: password,
      UserAttributes: [{ Name: "custom:internalId", Value: internalId }],
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

  async signIn({
    email,
    password,
  }: AuthGateway.SignInParams): Promise<AuthGateway.SignInResult> {
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

    if (
      !AuthenticationResult?.AccessToken ||
      !AuthenticationResult?.RefreshToken
    ) {
      throw new Error(`Failed to authenticate user ${email}.`);
    }

    return {
      accessToken: AuthenticationResult.AccessToken,
      refreshToken: AuthenticationResult.RefreshToken,
    };
  }

  async refreshToken({
    refreshToken,
  }: AuthGateway.RefreshTokenParams): Promise<AuthGateway.RefreshTokenResult> {
    try {
      const getTokenFromRefreshTokenCommand =
        new GetTokensFromRefreshTokenCommand({
          ClientId: this.appConfig.auth.cognito.client.id,
          RefreshToken: refreshToken,
          ClientSecret: this.appConfig.auth.cognito.client.secret,
        });

      const { AuthenticationResult } = await cognitoClient.send(
        getTokenFromRefreshTokenCommand
      );

      if (
        !AuthenticationResult?.AccessToken ||
        !AuthenticationResult?.RefreshToken
      ) {
        throw new Error("Failed to refresh token.");
      }

      return {
        accessToken: AuthenticationResult.AccessToken,
        refreshToken: AuthenticationResult.RefreshToken,
      };
    } catch (error) {
      if (error instanceof RefreshTokenReuseException) {
        throw new InvalidRefreshTokenError();
      }

      throw error;
    }
  }

  async forgotPassword({
    email,
  }: AuthGateway.ForgotPasswordParams): Promise<void> {
    const forgotPasswordCommand = new ForgotPasswordCommand({
      ClientId: this.appConfig.auth.cognito.client.id,
      Username: email,
      SecretHash: this.getSecretHash({ email }),
    });

    await cognitoClient.send(forgotPasswordCommand);
  }

  async confirmForgotPassword({
    email,
    confirmationCode,
    password,
  }: AuthGateway.ConfirmForgotPasswordParams): Promise<void> {
    const forgotPasswordCommand = new ConfirmForgotPasswordCommand({
      ClientId: this.appConfig.auth.cognito.client.id,
      Username: email,
      SecretHash: this.getSecretHash({ email }),
      ConfirmationCode: confirmationCode,
      Password: password,
    });

    await cognitoClient.send(forgotPasswordCommand);
  }

  private getSecretHash({
    email,
  }: AuthGateway.GetSecretHashParams): AuthGateway.GetSecretHashResult {
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
    internalId: string;
  };

  export type SignUpResult = {
    externalId: string;
  };

  export type SignInParams = {
    email: string;
    password: string;
  };

  export type SignInResult = {
    accessToken: string;
    refreshToken: string;
  };

  export type RefreshTokenParams = {
    refreshToken: string;
  };

  export type RefreshTokenResult = {
    accessToken: string;
    refreshToken: string;
  };

  export type ForgotPasswordParams = {
    email: string;
  };

  export type ConfirmForgotPasswordParams = {
    email: string;
    confirmationCode: string;
    password: string;
  };

  export type GetSecretHashParams = {
    email: string;
  };

  export type GetSecretHashResult = string;
}
