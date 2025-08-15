import { IQueueConsumer } from "@application/contracts/queue-consumer";
import { ProcessMealUseCase } from "@application/use-cases/meals/process-meal.usecase";
import { MealsQueueGateway } from "@infra/gateways/meals-queue.gateway";
import { Injectable } from "@kernel/decorators/injectable";

@Injectable()
export class MealsQueueConsumer
  implements IQueueConsumer<MealsQueueGateway.Message>
{
  constructor(private readonly processMealUseCase: ProcessMealUseCase) {}

  async process({
    accountId,
    mealId,
  }: MealsQueueGateway.Message): Promise<void> {
    await this.processMealUseCase.execute({ accountId, mealId });
  }
}
