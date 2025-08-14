import { IQueueConsumer } from "@application/contracts/queue-consumer";
import { MealsQueueGateway } from "@infra/gateways/meals-queue.gateway";
import { Injectable } from "@kernel/decorators/injectable";

@Injectable()
export class MealsQueueConsumer
  implements IQueueConsumer<MealsQueueGateway.Message>
{
  async process({
    accountId,
    mealId,
  }: MealsQueueGateway.Message): Promise<void> {
    // Implement your message processing logic here
    console.log("Processing message:", { accountId, mealId });
  }
}
