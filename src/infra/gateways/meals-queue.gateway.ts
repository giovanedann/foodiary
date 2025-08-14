import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from "@infra/clients/sqs.client";
import { Injectable } from "@kernel/decorators/injectable";
import { AppConfig } from "@shared/config/app.config";

@Injectable()
export class MealsQueueGateway {
  constructor(private readonly appConfig: AppConfig) {}

  async publish(message: MealsQueueGateway.Message): Promise<void> {
    const sendMessageCommand = new SendMessageCommand({
      QueueUrl: this.appConfig.queues.mealsQueueUrl,
      MessageBody: JSON.stringify(message),
    });

    await sqsClient.send(sendMessageCommand);
  }
}

export namespace MealsQueueGateway {
  export type Message = {
    accountId: string;
    mealId: string;
  };
}
