import { PreTokenGenerationV3TriggerEvent } from "aws-lambda";

export async function handler(event: PreTokenGenerationV3TriggerEvent) {
  event.response = {
    claimsAndScopeOverrideDetails: {
      accessTokenGeneration: {
        claimsToAddOrOverride: {},
      },
    },
  };

  return event;
}
