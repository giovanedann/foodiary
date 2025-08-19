import "reflect-metadata";

import { lambdaSQSAdapter } from "@main/adapters/lambda-sqs.adapter";
import { MealsQueueConsumer } from "src/queues/consumers/meals-queue.consumer";

export const handler = lambdaSQSAdapter(MealsQueueConsumer);
