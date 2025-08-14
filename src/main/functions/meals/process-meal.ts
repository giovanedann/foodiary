import "reflect-metadata";

import { Registry } from "@kernel/di/registry";
import { lambdaSQSAdapter } from "@main/adapters/lambda-sqs.adapter";
import { MealsQueueConsumer } from "src/queues/consumers/meals-queue.consumer";

const consumer = Registry.getInstance().resolve(MealsQueueConsumer);

export const handler = lambdaSQSAdapter(consumer);
