import { IFileEventHandler } from "@application/contracts/file-event-handler";
import { Injectable } from "@kernel/decorators/injectable";

@Injectable()
export class MealUploadedFileEventHandler implements IFileEventHandler {
  async handle({ fileKey }: IFileEventHandler.Input): Promise<void> {
    console.log(`Meal file uploaded: ${fileKey}`);
  }
}
