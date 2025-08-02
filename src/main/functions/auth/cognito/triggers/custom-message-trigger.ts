import { CustomMessageTriggerEvent } from "aws-lambda";

export async function handler(event: CustomMessageTriggerEvent) {
  if (event.triggerSource === "CustomMessage_ForgotPassword") {
    const recoveryCode = event.request.codeParameter;

    event.response.emailSubject = "🍏 Foodiary | Recupere sua conta";
    event.response.emailMessage = `O seu código de recuperação é: ${recoveryCode}`;
  }

  return event;
}
