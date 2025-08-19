import { SQSHandler } from "aws-lambda";

import { IQueueConsumer } from "@application/contracts/queue-consumer";
import { Registry } from "@kernel/di/registry";
import { Constructor } from "@shared/types/constructor";

export function lambdaSQSAdapter(
  queueConsumerImplementation: Constructor<IQueueConsumer<any>>
): SQSHandler {
  return async (event) => {
    const consumer = Registry.getInstance().resolve(
      queueConsumerImplementation
    );

    const recordsPromises = event.Records.map(async (record) => {
      const message = JSON.parse(record.body);

      await consumer.process(message);
    });

    await Promise.all(recordsPromises);
  };
}
