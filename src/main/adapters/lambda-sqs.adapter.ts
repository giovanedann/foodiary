import { IQueueConsumer } from "@application/contracts/queue-consumer";
import { SQSHandler } from "aws-lambda";

export function lambdaSQSAdapter(consumer: IQueueConsumer<any>): SQSHandler {
  return async (event) => {
    const recordsPromises = event.Records.map(async (record) => {
      const message = JSON.parse(record.body);

      await consumer.process(message);
    });

    await Promise.all(recordsPromises);
  };
}
