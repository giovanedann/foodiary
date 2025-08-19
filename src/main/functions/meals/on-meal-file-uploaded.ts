import "reflect-metadata";

import { MealUploadedFileEventHandler } from "@application/events/files/meal-uploaded-file-event-handler";
import { lambdaS3Adapter } from "@main/adapters/lambda-s3.adapter";

export const handler = lambdaS3Adapter(MealUploadedFileEventHandler);
