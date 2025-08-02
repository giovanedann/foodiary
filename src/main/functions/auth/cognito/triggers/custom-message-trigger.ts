import ForgotPasswordEmail from "@infra/emails/templates/forgot-password";
import { render } from "@react-email/render";
import { CustomMessageTriggerEvent } from "aws-lambda";

export async function handler(event: CustomMessageTriggerEvent) {
  if (event.triggerSource === "CustomMessage_ForgotPassword") {
    const recoveryCode = event.request.codeParameter;

    const compiledEmail = await render(
      ForgotPasswordEmail({ confirmationCode: recoveryCode })
    );

    event.response.emailSubject = "🍏 Foodiary | Recupere sua conta";
    event.response.emailMessage = compiledEmail;
  }

  return event;
}
