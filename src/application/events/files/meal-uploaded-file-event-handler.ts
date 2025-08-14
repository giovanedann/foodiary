import { IFileEventHandler } from "@application/contracts/file-event-handler";
import { MealUploadedUseCase } from "@application/use-cases/meals/meal-uploaded.usecase";
import { Injectable } from "@kernel/decorators/injectable";

@Injectable()
export class MealUploadedFileEventHandler implements IFileEventHandler {
  constructor(private readonly mealUploadedUsecase: MealUploadedUseCase) {}

  async handle({ fileKey }: IFileEventHandler.Input): Promise<void> {
    await this.mealUploadedUsecase.execute({ fileKey });
  }
}
