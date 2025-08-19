import { S3Handler } from "aws-lambda";

import { IFileEventHandler } from "@application/contracts/file-event-handler";
import { Registry } from "@kernel/di/registry";
import { Constructor } from "@shared/types/constructor";

export function lambdaS3Adapter(
  eventHandlerImplementation: Constructor<IFileEventHandler>
): S3Handler {
  return async (event) => {
    const eventHandler = Registry.getInstance().resolve(
      eventHandlerImplementation
    );

    const recordsPromises = event.Records.map(async (record) =>
      eventHandler.handle({
        fileKey: record.s3.object.key,
      })
    );

    const responses = await Promise.allSettled(recordsPromises);

    const failedEvents = responses.filter(
      (response) => response.status === "rejected"
    );

    for (const event of failedEvents) {
      console.error(JSON.stringify(event.reason, null, 2));
    }
  };
}
