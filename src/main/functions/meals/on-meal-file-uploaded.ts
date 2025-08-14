import "reflect-metadata";

import { MealUploadedFileEventHandler } from "@application/events/files/meal-uploaded-file-event-handler";
import { Registry } from "@kernel/di/registry";
import { lambdaS3Adapter } from "@main/adapters/lambda-s3-adapter";

const eventHandler = Registry.getInstance().resolve(
  MealUploadedFileEventHandler,
);

export const handler = lambdaS3Adapter(eventHandler);
